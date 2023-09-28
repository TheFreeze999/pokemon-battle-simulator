import Battle from "../Battle.js";
import BattleAction from "./BattleAction.js";

class BattleQueue {
	actions: BattleAction[] = [];
	constructor(public readonly battle: Battle) {

	}

	push(action: BattleAction) {
		action.queue = this;
		this.actions.push(action);
	}

	async renderNextActionThenRemove() {
		const action = this.actions.sort((a, b) => b.priority - a.priority)[0];
		await action.execute();
		action.removeSelfFromQueue();
	}

	async executeAll() {
		while (this.actions.length > 0) {
			await this.renderNextActionThenRemove();
		}
	}
}

export default BattleQueue;