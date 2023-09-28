import Battler from "../../Battler.js";
import Move from "../../Move.js";
import { delay } from "../../util.js";
import BattleAction from "../BattleAction.js";

class FaintAction extends BattleAction {
	constructor(public target: Battler) {
		super();
	}
	async execute() {
		console.log(`${this.target.name} fainted!`);
		this.target.fainted = true;
	}
}

export default FaintAction;