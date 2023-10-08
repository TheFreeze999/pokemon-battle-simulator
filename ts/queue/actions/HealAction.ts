import Battler from "../../Battler.js";
import BattleAction from "../BattleAction.js";

class HealAction extends BattleAction {
	constructor(public target: Battler, public amount: number) {
		super();
		this.amount = Math.floor(amount);
		if (amount > 0 && this.amount <= 0) this.amount = 1;
	}
	clause() {
		if (this.target.fainted) return false;
		if (this.amount <= 0) return false;
		if (this.target.initialStats.currentHp >= this.target.initialStats.hp) return false;
		return true;
	}
	async execute() {
		if (this.amount === 0) return;
		let amount = this.amount;
		const maxHealableAmount = this.target.initialStats.hp - this.target.initialStats.currentHp;
		if (amount > maxHealableAmount) amount = maxHealableAmount;
		const oldHpPercentage = this.target.hpPercentage;

		await this.queue?.battle.renderer.showTextWhilePausingQueue(`${this.target.displayName} was healed by ${amount} HP!`);
		this.target.initialStats.currentHp += amount;
		await this.queue?.battle.renderer.setHPPercentageTo(this.target, oldHpPercentage, this.target.hpPercentage);


		await this.queue?.battle.renderer.showTextWhilePausingQueue(`${this.target.displayName} now has ${this.target.initialStats.currentHp} HP!`);
	}
}

export default HealAction;