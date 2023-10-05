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
        const infoText = Stats.getStatStageChangeInfoText(this.target.displayName, this.stat, this.amount);
        if (infoText)
            console.log(infoText);
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
