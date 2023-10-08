import BattleAction from "../BattleAction.js";
import FaintAction from "./FaintAction.js";
class DamageAction extends BattleAction {
    target;
    amount;
    isDirectDamage = false;
    showText = true;
    showHpRemainingText = true;
    constructor(target, amount) {
        super();
        this.target = target;
        this.amount = amount;
        this.amount = Math.floor(amount);
        if (amount > 0 && this.amount <= 0)
            this.amount = 1;
    }
    clause() {
        if (this.target.fainted)
            return false;
        if (this.amount <= 0)
            return false;
        return true;
    }
    async execute() {
        if (this.amount === 0)
            return;
        let amount = this.amount;
        if (amount > this.target.initialStats.currentHp)
            amount = this.target.initialStats.currentHp;
        const oldHpPercentage = this.target.hpPercentage;
        if (this.showText)
            await this.queue?.battle.renderer.showTextWhilePausingQueue(`${this.target.displayName} lost ${amount} HP!`);
        this.target.initialStats.currentHp -= amount;
        await this.queue?.battle.renderer.setHPPercentageTo(this.target, oldHpPercentage, this.target.hpPercentage);
        if (this.target.initialStats.currentHp <= 0) {
            const faintAction = new FaintAction(this.target);
            faintAction.priority = 10;
            this.queue?.push(faintAction);
            return;
        }
        if (this.showHpRemainingText)
            await this.queue?.battle.renderer.showTextWhilePausingQueue(`${this.target.displayName} now has ${this.target.initialStats.currentHp} HP!`);
    }
}
export default DamageAction;
