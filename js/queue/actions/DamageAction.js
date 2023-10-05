import BattleAction from "../BattleAction.js";
import FaintAction from "./FaintAction.js";
class DamageAction extends BattleAction {
    target;
    amount;
    isDirectDamage = false;
    constructor(target, amount) {
        super();
        this.target = target;
        this.amount = amount;
        this.amount = Math.floor(amount);
    }
    clause() {
        if (this.target.fainted)
            return false;
        if (this.amount <= 0)
            return false;
        return true;
    }
    async execute() {
        let amount = this.amount;
        if (amount > this.target.initialStats.currentHp)
            amount = this.target.initialStats.currentHp;
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
