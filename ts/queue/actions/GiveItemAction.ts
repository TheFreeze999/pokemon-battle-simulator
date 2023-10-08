import Battler from "../../Battler.js";
import Item from "../../Item.js";
import BattleAction from "../BattleAction.js";

class GiveItemAction extends BattleAction {
	showText = true;
	constructor(public target: Battler, public item: Item) {
		super();
	}
	clause() {
		if (this.target.fainted) return false;
		if (this.target.heldItem) return false;
		return true;
	}
	async execute() {
		if (this.showText)
			await this.queue?.battle.renderer.showTextWhilePausingQueue(`${this.target.displayName} received a ${this.item.displayName}!`);
		this.target.heldItem = this.item;
	}
}

export default GiveItemAction;