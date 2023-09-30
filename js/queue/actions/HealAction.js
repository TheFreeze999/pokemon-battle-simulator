import BattleAction from "../BattleAction.js";
class HealAction extends BattleAction {
    target;
    amount;
    constructor(target, amount) {
        super();
        this.target = target;
        this.amount = amount;
    }
    async execute() {
        if (this.amount < 0 || this.target.fainted)
            return;
        console.log(`${this.target.displayName} was healed by ${this.amount} HP!`);
        this.target.initialStats.currentHp += this.amount;
        console.log(`${this.target.displayName} now has ${this.target.initialStats.currentHp} HP!`);
    }
}
export default HealAction;
