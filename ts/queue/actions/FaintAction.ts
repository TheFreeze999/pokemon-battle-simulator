import Battler from "../../Battler.js";
import Move from "../../Move.js";
import { delay } from "../../util.js";
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
		console.log(`${this.target.displayName} fainted!`);
		this.target.fainted = true;
	}
}

export default FaintAction;