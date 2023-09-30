import Battler from "../../Battler.js";
import { delay } from "../../util.js";
import BattleAction from "../BattleAction.js";
import FaintAction from "./FaintAction.js";

class HealAction extends BattleAction {
	constructor(public target: Battler, public amount: number) {
		super();
	}
	async execute() {
		if (this.amount < 0 || this.target.fainted) return;

		console.log(`${this.target.displayName} was healed by ${this.amount} HP!`);

		this.target.initialStats.currentHp += this.amount;

		console.log(`${this.target.displayName} now has ${this.target.initialStats.currentHp} HP!`);
	}
}

export default HealAction;