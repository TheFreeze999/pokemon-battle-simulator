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
    async execute() {
        if (this.amount === 0 || this.target.fainted)
            return;
        const infoText = Stats.getStatStageChangeInfoText(this.target.displayName, this.stat, this.amount);
        if (infoText)
            console.log(infoText);
        this.target.statBoosts[this.stat] += this.amount;
        this.target.statBoosts = Stats.BaseStatsWithoutHP.normalize(this.target.statBoosts);
    }
}
export default StatStageChangeAction;
