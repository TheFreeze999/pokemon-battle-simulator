import Battler from "../../Battler.js";
import Move from "../../Move.js";
import { TypeUtils } from "../../Type.js";
import { delay } from "../../util.js";
import BattleAction from "../BattleAction.js";
import DamageAction from "./DamageAction.js";

class MoveAction extends BattleAction {
	attackStatMultiplier = 1;
	negateDirectDamage = false;
	performSecondaryEffects = true;
	showTypeEffectivenessInfoText = true;

	constructor(public user: Battler, public target: Battler, public move: Move) {
		super();
	}
	async execute() {
		if (this.user.fainted || this.target.fainted) return;
		if (!this.user.moves.includes(this.move)) return;

		console.log("-------------")


		console.log(`${this.user.displayName} used ${this.move.displayName} on ${this.target.displayName}!`);

		if (this.move.category !== Move.Category.STATUS && this.move.basePower !== undefined && this.move.dealStandardDamage) {
			const userBoostedStats = this.user.getEffectiveStats();
			const targetBoostedStats = this.target.getEffectiveStats();
			let attackingStat = this.move.category === Move.Category.PHYSICAL ? userBoostedStats.attack : userBoostedStats.specialAttack;
			const defendingStat = this.move.category === Move.Category.PHYSICAL ? targetBoostedStats.defense : targetBoostedStats.specialDefense;

			attackingStat *= this.attackStatMultiplier;

			const typeEffectiveness = TypeUtils.calculateEffectiveness([this.move.type], this.target.types);
			const stab = this.user.types.includes(this.move.type) ? 1.5 : 1;
			const multiplier = typeEffectiveness * stab;

			const typeEffectivenessInfoText = TypeUtils.getInfoFromEffectiveness(typeEffectiveness);
			if (typeEffectivenessInfoText && this.showTypeEffectivenessInfoText) console.log(typeEffectivenessInfoText);

			if (typeEffectiveness !== 0 && !this.negateDirectDamage) {
				const damageAmount = Move.standardDamageCalculation(this.user.level, attackingStat, defendingStat, this.move.basePower, multiplier);
				const damageAction = new DamageAction(this.target, damageAmount);
				damageAction.priority = 5;
				this.queue?.push(damageAction);
			}
		}
		if (this.performSecondaryEffects)
			this.move.applySecondaryEffects(this);
	}
}

export default MoveAction;