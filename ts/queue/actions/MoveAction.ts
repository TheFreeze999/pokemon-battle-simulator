import Battler from "../../Battler.js";
import Move from "../../Move.js";
import { delay } from "../../util.js";
import BattleAction from "../BattleAction.js";
import DamageAction from "./DamageAction.js";

class MoveAction extends BattleAction {
	constructor(public user: Battler, public target: Battler, public move: Move) {
		super();
	}
	async execute() {
		console.log(`${this.user.name} used ${this.move.name} on ${this.target.name}`);

		await delay(2000);

		if (this.move.category !== Move.Category.STATUS && this.move.basePower !== undefined) {
			const userBoostedStats = this.user.calcBoostedStats();
			const targetBoostedStats = this.target.calcBoostedStats();
			const attackingStat = this.move.category === Move.Category.PHYSICAL ? userBoostedStats.attack : userBoostedStats.specialAttack;
			const defendingStat = this.move.category === Move.Category.PHYSICAL ? targetBoostedStats.defense : targetBoostedStats.specialDefense;
			// include type effectiveness and STAB
			const damageAmount = Move.standardDamageCalculation(this.user.level, attackingStat, defendingStat, this.move.basePower, 1);
			const damageAction = new DamageAction(this.target, damageAmount);
			this.queue?.push(damageAction)
		}
	}
}

export default MoveAction;