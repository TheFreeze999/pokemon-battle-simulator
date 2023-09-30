import Battler from "../../Battler.js";
import { delay } from "../../util.js";
import BattleAction from "../BattleAction.js";
import FaintAction from "./FaintAction.js";

class DamageAction extends BattleAction {
	constructor(public target: Battler, public amount: number) {
		super();
	}
	async execute() {
		if (this.amount < 0) return;

		console.log(`${this.target.displayName} took ${this.amount} damage!`);

		this.target.stats.currentHp -= this.amount;

		if (this.target.stats.currentHp <= 0) {
			const faintAction = new FaintAction(this.target);
			faintAction.priority = 10;
			this.queue?.push(faintAction);
			return;
		}

		console.log(`${this.target.displayName} now has ${this.target.stats.currentHp} HP!`);
	}
}

export default DamageAction;