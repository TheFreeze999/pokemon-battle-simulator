import Battler from "../../Battler.js";
import BattleAction from "../BattleAction.js";

class FaintAction extends BattleAction {
	constructor(public target: Battler) {
		super();
	}
	clause() {
		if (this.target.fainted) return false;
		return true;
	}
	async execute() {
		this.target.fainted = true;
		await this.queue?.battle.renderer.showTextWhilePausingQueue(`${this.target.displayName} fainted!`);
		await this.queue?.battle.renderer.showFaintAnimation(this.target);
	}
}

export default FaintAction;