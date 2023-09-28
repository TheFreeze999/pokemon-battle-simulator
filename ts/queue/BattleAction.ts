import BattleQueue from "./BattleQueue.js";

abstract class BattleAction {
	queue: BattleQueue | null = null;
	/* Highest first */
	priority = 0;
	abstract execute(): Promise<void>;

	removeSelfFromQueue() {
		if (!this.queue) return
		this.queue.actions.splice(this.queue.actions.indexOf(this), 1);
	}
}

export default BattleAction;