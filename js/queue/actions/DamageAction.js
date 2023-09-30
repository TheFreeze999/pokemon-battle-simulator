import { delay } from "../../util.js";
import BattleAction from "../BattleAction.js";
import FaintAction from "./FaintAction.js";
class DamageAction extends BattleAction {
    target;
    amount;
    constructor(target, amount) {
        super();
        this.target = target;
        this.amount = amount;
    }
    async execute() {
        if (this.amount < 0)
            return;
        console.log(`${this.target.displayName} took ${this.amount} damage!`);
        this.target.stats.currentHp -= this.amount;
        await delay(1000);
        if (this.target.stats.currentHp <= 0) {
            const faintAction = new FaintAction(this.target);
            this.queue?.push(faintAction);
            return;
        }
        console.log(`${this.target.displayName} now has ${this.target.stats.currentHp} HP!`);
    }
}
export default DamageAction;
