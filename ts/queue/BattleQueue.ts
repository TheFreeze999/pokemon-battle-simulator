import Battle from "../Battle.js";
import Events from "../Events.js";
import BattleAction from "./BattleAction.js";

class BattleQueue {
	actions: BattleAction[] = [];
	currentlyBeingExecuted: BattleAction | null = null;
	paused = false;
	eventHandler = new Events.Handler();
	constructor(public readonly battle: Battle) {

	}

	push(...actions: BattleAction[]): void {
		actions.forEach(action => {
			action.queue = this;
			this.actions.push(action);
			action.eventHandler.dispatchEvent('add');
		})
	}

	async executeNextActionThenRemove() {
		const action = this.actions.sort((a, b) => b.priority - a.priority)[0];
		this.currentlyBeingExecuted = action;
		await action.modifyThenExecuteIfAllowed();
		action.removeSelfFromQueue();
		this.currentlyBeingExecuted = null;
	}

	async executeAll() {
		while (this.actions.length > 0) {
			if (this.paused) await this.eventHandler.awaitDispatch('resume');
			else await this.executeNextActionThenRemove();
		}
	}

	pause() {
		this.eventHandler.dispatchEvent('pause');
		this.paused = true;
	}
	resume() {
		this.eventHandler.dispatchEvent('resume');
		this.paused = false;
	}
}

export default BattleQueue;