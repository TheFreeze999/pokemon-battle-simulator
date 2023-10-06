import Battler from "../../Battler.js";
import BattleAction from "../BattleAction.js";

class HealAction extends BattleAction {
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
		const maxHealableAmount = this.target.initialStats.hp - this.target.initialStats.currentHp;
		if (amount > maxHealableAmount) amount = maxHealableAmount;

		await this.queue?.battle.renderer.showTextWhilePausingQueue(`${this.target.displayName} was healed by ${amount} HP!`);

		this.target.initialStats.currentHp += amount;

		await this.queue?.battle.renderer.showTextWhilePausingQueue(`${this.target.displayName} now has ${this.target.initialStats.currentHp} HP!`);
	}
}

export default HealAction;