import Battler from "../../Battler.js";
import { delay } from "../../util.js";
import BattleAction from "../BattleAction.js";
import FaintAction from "./FaintAction.js";

class DamageAction extends BattleAction {
	isDirectDamage = false;
	constructor(public target: Battler, public amount: number) {
		super();
	}
	clause() {
		if (this.target.fainted) return false;
		if (this.amount <= 0) return false;
		return true;
	}
	async execute() {
		let amount = this.amount;
		if (amount > this.target.initialStats.currentHp) amount = this.target.initialStats.currentHp;

		console.log(`${this.target.displayName} took ${amount} damage!`);

		this.target.initialStats.currentHp -= amount;

		if (this.target.initialStats.currentHp <= 0) {
			const faintAction = new FaintAction(this.target);
			faintAction.priority = 10;
			this.queue?.push(faintAction);
			return;
		}

		console.log(`${this.target.displayName} now has ${this.target.initialStats.currentHp} HP!`);
	}
}

export default DamageAction;