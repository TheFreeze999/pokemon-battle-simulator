import Stats from "../../Stats.js";
import BattleAction from "../BattleAction.js";
class StatStageChangeAction extends BattleAction {
    target;
    stat;
    amount;
    constructor(target, stat, amount) {
        super();
        this.target = target;
        this.stat = stat;
        this.amount = amount;
    }
    clause() {
        if (this.target.fainted)
            return false;
        return true;
    }
    async execute() {
        if (this.amount === 0 || this.target.fainted)
            return;
        const rendererPromises = [this.queue?.battle.renderer.showStatStageChange(this.target, this.amount)];
        const statAmountBeforeChange = this.stat === "accuracy" || this.stat === "evasion" ? this.target.accuracyEvasionBoosts[this.stat] : this.target.statBoosts[this.stat];
        let infoText = Stats.getStatStageChangeInfoText(this.target.displayName, this.stat, this.amount);
        if (this.amount > 0 && statAmountBeforeChange >= 6)
            infoText = `${this.target.displayName}'s ${Stats.toDisplayName(this.stat)} won't go any higher!`;
        if (this.amount < 0 && statAmountBeforeChange <= -6)
            infoText = `${this.target.displayName}'s ${Stats.toDisplayName(this.stat)} won't go any lower!`;
        if (infoText)
            rendererPromises.push(this.queue?.battle.renderer.showTextWhilePausingQueue(infoText));
        await Promise.all(rendererPromises);
        if (this.stat === "accuracy" || this.stat === "evasion") {
            this.target.accuracyEvasionBoosts[this.stat] += this.amount;
        }
        else {
            this.target.statBoosts[this.stat] += this.amount;
        }
        this.target.accuracyEvasionBoosts = Stats.normalize(this.target.accuracyEvasionBoosts);
        this.target.statBoosts = Stats.normalize(this.target.statBoosts);
    }
}
export default StatStageChangeAction;
