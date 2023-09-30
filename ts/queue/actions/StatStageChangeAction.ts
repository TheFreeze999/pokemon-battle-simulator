import Battler from "../../Battler.js";
import Stats from "../../Stats.js";
import BattleAction from "../BattleAction.js";

class StatStageChangeAction extends BattleAction {
	reasonText: string | null = null;
	constructor(public target: Battler, public stat: keyof Stats.BaseStatsWithoutHP, public amount: number) {
		super();
	}
	async execute() {
		if (this.amount === 0 || this.target.fainted) return;

		if (this.reasonText) console.log(this.reasonText);

		const infoText = Stats.getStatStageChangeInfoText(this.target.displayName, this.stat, this.amount);
		if (infoText) console.log(infoText);

		this.target.statBoosts[this.stat] += this.amount;
		this.target.statBoosts = Stats.BaseStatsWithoutHP.normalize(this.target.statBoosts);
	}
}

export default StatStageChangeAction;