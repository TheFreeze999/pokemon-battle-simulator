import Stats from "../../Stats.js";
import BattleAction from "../BattleAction.js";
class StatStageChangeAction extends BattleAction {
    target;
    stat;
    amount;
    reasonText = null;
    constructor(target, stat, amount) {
        super();
        this.target = target;
        this.stat = stat;
        this.amount = amount;
    }
    async execute() {
        if (this.amount === 0 || this.target.fainted)
            return;
        if (this.reasonText)
            console.log(this.reasonText);
        const infoText = Stats.getStatStageChangeInfoText(this.target.displayName, this.stat, this.amount);
        if (infoText)
            console.log(infoText);
        if (this.stat === "accuracy" || this.stat === "evasion") {
            this.target.accuracyEvasionBoosts[this.stat] += this.amount;
            this.target.accuracyEvasionBoosts = Stats.AccuracyEvasionStats.normalize(this.target.accuracyEvasionBoosts);
        }
        else {
            this.target.statBoosts[this.stat] += this.amount;
            this.target.statBoosts = Stats.BaseStatsWithoutHP.normalize(this.target.statBoosts);
        }
    }
}
export default StatStageChangeAction;
