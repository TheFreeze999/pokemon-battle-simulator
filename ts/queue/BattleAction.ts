import { randomInteger } from "../util.js";
import BattleQueue from "./BattleQueue.js";

abstract class BattleAction {
	queue: BattleQueue | null = null;
	/* Highest first */
	priority = 0;

	toExecute = true;
	chance = [100, 100];

	executionStarted = false;

	protected abstract execute(): Promise<void>;

	async executeIfAllowed() {
		if (!this.toExecute) return;
		const [selected, total] = this.chance;
		const randomNum = randomInteger(1, total);
		if (randomNum > selected) return;

		this.executionStarted = true;
		await this.execute();
	}

	removeSelfFromQueue() {
		if (!this.queue) return
		this.queue.actions.splice(this.queue.actions.indexOf(this), 1);
	}
}

export default BattleAction;