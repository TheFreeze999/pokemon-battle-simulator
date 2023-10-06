import Battler from "../../Battler.js";
import Stats from "../../Stats.js";
import BattleAction from "../BattleAction.js";

class StatStageChangeAction extends BattleAction {
	constructor(public target: Battler, public stat: keyof (Stats.BaseStatsWithoutHP & Stats.AccuracyEvasionStats), public amount: number) {
		super();
	}
	clause() {
		if (this.target.fainted) return false;
		return true;
	}
	async execute() {
		if (this.amount === 0 || this.target.fainted) return;

		const infoText = Stats.getStatStageChangeInfoText(this.target.displayName, this.stat, this.amount);
		if (infoText) await this.queue?.battle.renderer.showTextWhilePausingQueue(infoText);

		if (this.stat === "accuracy" || this.stat === "evasion") {
			this.target.accuracyEvasionBoosts[this.stat] += this.amount;
		} else {
			this.target.statBoosts[this.stat] += this.amount;
		}
		this.target.accuracyEvasionBoosts = Stats.normalize(this.target.accuracyEvasionBoosts);
		this.target.statBoosts = Stats.normalize(this.target.statBoosts);
	}
}

export default StatStageChangeAction;