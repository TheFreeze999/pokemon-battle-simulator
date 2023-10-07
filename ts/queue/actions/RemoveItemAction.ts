import Battler from "../../Battler.js";
import BattleAction from "../BattleAction.js";

class RemoveItemAction extends BattleAction {
	showText = true;
	constructor(public target: Battler) {
		super();
	}
	clause() {
		if (this.target.fainted) return false;
		if (!this.target.heldItem) return false;
		return true;
	}
	async execute() {
		if (this.showText)
			await this.queue?.battle.renderer.showTextWhilePausingQueue(`${this.target.displayName}'s ${this.target.heldItem?.displayName} was removed.`);
		this.target.heldItem = null;
	}
}

export default RemoveItemAction;