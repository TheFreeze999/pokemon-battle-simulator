import BattleAction from "../BattleAction.js";
class HealAction extends BattleAction {
    target;
    amount;
    reasonText = null;
    constructor(target, amount) {
        super();
        this.target = target;
        this.amount = amount;
    }
    clause() {
        if (this.target.fainted)
            return false;
        if (this.amount <= 0)
            return false;
        return true;
    }
    async execute() {
        if (this.reasonText)
            console.log(this.reasonText);
        let amount = this.amount;
        const maxHealableAmount = this.target.initialStats.hp - this.target.initialStats.currentHp;
        if (amount > maxHealableAmount)
            amount = maxHealableAmount;
        console.log(`${this.target.displayName} was healed by ${amount} HP!`);
        this.target.initialStats.currentHp += amount;
        console.log(`${this.target.displayName} now has ${this.target.initialStats.currentHp} HP!`);
    }
}
export default HealAction;
