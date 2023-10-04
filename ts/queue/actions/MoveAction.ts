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
	missed = false;
	isCriticalHit = false;

	constructor(public user: Battler, public target: Battler, public move: Move) {
		super();
		this.missed = this.calculateMiss();
		this.isCriticalHit = this.calculateCriticalHit();
	}

	clause() {
		if (this.user.fainted || this.target.fainted) return false;
		if (!this.user.moves.includes(this.move)) return false;
		return true;
	}
	/** Calculates the chance of a miss and returns true if the move should miss. */
	private calculateMiss() {
		let accuracy = this.move.accuracy;

		if (this.forceMoveHit) return false;
		if (accuracy < 0) return false;

		const random = randomInteger(1, 100);
		const attackerAccuracy = this.user.getEffectiveAccuracyAndEvasion().accuracy;
		const defenderEvasion = this.target.getEffectiveAccuracyAndEvasion().evasion;


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
		console.log("-------------");

		if (this.user === this.target)
			console.log(`${this.user.displayName} used ${this.move.displayName}!`);
		else
			console.log(`${this.user.displayName} used ${this.move.displayName} on ${this.target.displayName}!`);

		await delay(500);

		if (this.missed) {
			console.log(`The move missed!`);
			return;
		}

		if (this.move.category !== Move.Category.STATUS && this.move.basePower !== undefined && this.move.dealDirectDamage) {
			const userStatBoosts = this.isCriticalHit ? Stats.BaseStatsWithoutHP.getOnlyPositiveOrNegative(this.user.statBoosts, 1) : this.user.statBoosts;
			const targetStatBoosts = this.isCriticalHit ? Stats.BaseStatsWithoutHP.getOnlyPositiveOrNegative(this.target.statBoosts, -1) : this.target.statBoosts;
			const userBoostedStats = this.user.getEffectiveStats(userStatBoosts);
			const targetBoostedStats = this.target.getEffectiveStats(targetStatBoosts);
			let attackingStat = this.move.category === Move.Category.PHYSICAL ? userBoostedStats.attack : userBoostedStats.specialAttack;
			const defendingStat = this.move.category === Move.Category.PHYSICAL ? targetBoostedStats.defense : targetBoostedStats.specialDefense;

			attackingStat *= this.attackStatMultiplier;

			const typeEffectiveness = TypeUtils.calculateEffectiveness([this.move.type], this.target.types);
			const stab = this.user.types.includes(this.move.type) ? 1.5 : 1;
			let multiplier = typeEffectiveness * stab * this.directDamageMultiplier;
			if (typeEffectiveness === 0) this.isCriticalHit = false;
			if (this.isCriticalHit) multiplier *= 1.5;

			const typeEffectivenessInfoText = TypeUtils.getInfoFromEffectiveness(typeEffectiveness);
			if (typeEffectivenessInfoText && this.showTypeEffectivenessInfoText) console.log(typeEffectivenessInfoText);

			if (this.isCriticalHit) {
				console.log(`A critical hit!`);
				await delay(500);
			}

			if (typeEffectiveness !== 0 && !this.negateDirectDamage) {
				const damageAmount = Move.standardDamageCalculation(this.user.level, attackingStat, defendingStat, this.move.basePower, multiplier);
				const damageAction = new DamageAction(this.target, damageAmount);
				damageAction.priority = 5;
				damageAction.isDirectDamage = true;
				this.queue?.push(damageAction);
			}
		}
		if (this.performSecondaryEffects) {
			this.move.applySecondaryEffects(this);
		}
	}


}

export default MoveAction;