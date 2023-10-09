import Battler from "../../Battler.js";
import Move from "../../Move.js";
import Stats from "../../Stats.js";
import { TypeUtils } from "../../Type.js";
import { delay, randomInteger } from "../../util.js";
import BattleAction from "../BattleAction.js";
import DamageAction from "./DamageAction.js";

class MoveAction extends BattleAction {
	attackStatMultiplier = 1;
	accuracyMultiplier = 1;
	directDamageMultiplier = 1;
	forceMoveHit = false;
	negateDirectDamage = false;
	performSecondaryEffects = true;
	showTypeEffectivenessInfoText = true;
	missedOnTargets = new Map<Battler, boolean>();
	criticalHitOnTargets = new Map<Battler, boolean>();
	stoppedByTypeImmunityOnTargets = new Map<Battler, boolean>();

	constructor(public user: Battler, public targets: Battler[], public move: Move) {
		super();
		this.targets.forEach(target => {
			this.missedOnTargets.set(target, this.calculateMiss(target));
			this.criticalHitOnTargets.set(target, this.calculateCriticalHit());
		});
	}

	clause() {
		if (this.user.fainted || this.targets.every(target => target.fainted)) return false;
		if (!this.user.usableMoves.includes(this.move)) return false;
		if (this.move.targeting === Move.Targeting.NONE && this.targets.length !== 0) return false;
		if (this.move.targeting === Move.Targeting.SELF && !(this.targets.length === 1 && this.targets[0] === this.user)) return false;
		if (this.move.targeting === Move.Targeting.ENEMY && !(this.targets.length === 1 && this.targets[0] !== this.user)) return false;
		return true;
	}
	/** Calculates the chance of a miss and returns true if the move should miss. */
	private calculateMiss(target: Battler) {
		let accuracy = this.move.accuracy;

		if (this.forceMoveHit) return false;
		if (accuracy < 0) return false;

		const random = randomInteger(1, 100);
		const attackerAccuracy = this.user.getEffectiveAccuracyAndEvasion().accuracy;
		const defenderEvasion = target.getEffectiveAccuracyAndEvasion().evasion;


		if (defenderEvasion > 0) {
			const fraction = attackerAccuracy / defenderEvasion;
			accuracy *= fraction;
		}

		accuracy *= this.accuracyMultiplier;

		return random > accuracy;
	}
	/** Calculates the chance of a critical hit and returns true if the move should crit. */
	private calculateCriticalHit() {
		const criticalHitRatio = Math.round(this.user.criticalHitRatio + this.move.criticalHitRatio);

		if (criticalHitRatio === 0) return randomInteger(1, 24) === 1;
		if (criticalHitRatio === 1) return randomInteger(1, 8) === 1;
		if (criticalHitRatio === 2) return randomInteger(1, 2) === 1;
		if (criticalHitRatio >= 3) return true;

		return false;
	}

	async execute() {
		if (this.move.targeting === Move.Targeting.ENEMY) {
			for (const target of this.targets) {
				const isMissed = this.missedOnTargets.get(target) === true;
				const isCriticalHit = this.criticalHitOnTargets.get(target) === true;

				await this.queue?.battle.renderer.shakeBattler(this.user);
				await this.queue?.battle.renderer.showTextWhilePausingQueue(`${this.user.displayName} used ${this.move.displayName} on ${target.displayName}!`);

				if (isMissed) {
					await this.queue?.battle.renderer.showTextWhilePausingQueue(`The move missed!`);
					return;
				}

				if (this.move.category !== Move.Category.STATUS && this.move.basePower !== undefined && this.move.dealDirectDamage) {
					const userStatBoosts = isCriticalHit ? Stats.BaseStatsWithoutHP.getOnlyPositiveOrNegative(this.user.statBoosts, 1) : this.user.statBoosts;
					const targetStatBoosts = isCriticalHit ? Stats.BaseStatsWithoutHP.getOnlyPositiveOrNegative(target.statBoosts, -1) : target.statBoosts;
					const userBoostedStats = this.user.getEffectiveStats(userStatBoosts);
					const targetBoostedStats = target.getEffectiveStats(targetStatBoosts);
					let attackingStat = this.move.category === Move.Category.PHYSICAL ? userBoostedStats.attack : userBoostedStats.specialAttack;
					attackingStat *= this.attackStatMultiplier;
					const defendingStat = this.move.category === Move.Category.PHYSICAL ? targetBoostedStats.defense : targetBoostedStats.specialDefense;

					let typeEffectiveness = TypeUtils.calculateEffectiveness([this.move.type], target.types);
					if (this.move.ignoreTypeEffectiveness) typeEffectiveness = 1;
					const stab = this.user.types.includes(this.move.type) ? 1.5 : 1;
					let multiplier = typeEffectiveness * stab * this.directDamageMultiplier;
					if (typeEffectiveness === 0) {
						this.stoppedByTypeImmunityOnTargets.set(target, true);
						this.criticalHitOnTargets.set(target, false);
					}
					if (this.criticalHitOnTargets.get(target) === true) multiplier *= 1.5;

					const typeEffectivenessInfoText = TypeUtils.getInfoFromEffectiveness(typeEffectiveness);
					if (typeEffectivenessInfoText && this.showTypeEffectivenessInfoText) {
						const name = TypeUtils.getNameFromEffectiveness(typeEffectiveness)
						await this.queue?.battle.renderer.showTextWhilePausingQueue(typeEffectivenessInfoText, ["type-effectiveness", name]);
					}

					if (this.criticalHitOnTargets.get(target) === true) {
						await this.queue?.battle.renderer.showTextWhilePausingQueue(`A critical hit!`, ["critical"]);
					}

					if (typeEffectiveness !== 0 && !this.negateDirectDamage) {
						const damageAmount = Move.standardDamageCalculation(this.user.level, attackingStat, defendingStat, this.move.basePower, multiplier);
						const damageAction = new DamageAction(target, damageAmount);
						damageAction.priority = 5;
						damageAction.isDirectDamage = true;
						this.queue?.push(damageAction);
					}
				}
			}
		}

		if (this.performSecondaryEffects) {
			this.move.applySecondaryEffects(this);
		}
		this.user.movePp.set(this.move, (this.user.movePp.get(this.move) ?? 0) - 1);
	}

	get allMissed() {
		return Array.from(this.missedOnTargets).every((battler, missed) => missed);
	}
	get allStoppedByTypeImmunity() {
		return Array.from(this.stoppedByTypeImmunityOnTargets).every((battler, stoppedByTypeImmunity) => stoppedByTypeImmunity);
	}

	isSuccessful() {
		return !this.allMissed && !this.allStoppedByTypeImmunity
	}
}

export default MoveAction;