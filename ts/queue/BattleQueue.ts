import Battle from "../Battle.js";
import BattleAction from "./BattleAction.js";

class BattleQueue {
	actions: BattleAction[] = [];
	currentlyBeingExecuted: BattleAction | null = null;
	constructor(public readonly battle: Battle) {

	}

	push(...actions: BattleAction[]): void {
		actions.forEach(action => {
			action.queue = this;
			this.actions.push(action);
		})
	}

	async executeNextActionThenRemove() {
		const action = this.actions.sort((a, b) => b.priority - a.priority)[0];
		this.currentlyBeingExecuted = action;
		await action.execute();
		action.removeSelfFromQueue();
		this.currentlyBeingExecuted = null;
	}

	async executeAll() {
		while (this.actions.length > 0) {
			await this.executeNextActionThenRemove();
		}
	}
}

export default BattleQueue;