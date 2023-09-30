import Ability from "../Ability.js";
import Battler from "../Battler.js";
import { randomInteger } from "../util.js";
import BattleQueue from "./BattleQueue.js";

abstract class BattleAction {
	queue: BattleQueue | null = null;
	/* Highest first */
	priority = 0;

	toExecute = true;
	chance = [100, 100];

	executionStarted = false;

	cause: BattleAction | null = null;

	flags: Record<keyof any, boolean> = {};

	protected abstract execute(): Promise<void>;

	async modifyThenExecuteIfAllowed() {
		this.applyModificationsToSelf();

		if (!this.toExecute) return;
		const [selected, total] = this.chance;
		const randomNum = randomInteger(1, total);
		if (randomNum > selected) return;

		this.executionStarted = true;
		await this.execute();
	}

	async applyModificationsToSelf() {
		if (!this.queue) return;
		const allBattlers = this.queue.battle.allBattlers;
		const battlerModifierPairs: { battler: Battler, modifier: Ability.BattleActionModifier }[] = [];
		for (const battler of allBattlers) {
			for (const modifier of battler.ability.battleActionModifiers) {
				battlerModifierPairs.push({ battler, modifier })
			}
		}

		const battlerModifierPairsSorted = battlerModifierPairs.sort((a, b) => b.modifier.priority - a.modifier.priority);

		for (const { battler, modifier } of battlerModifierPairsSorted) {
			modifier.modify(this, battler)
		}
	}

	removeSelfFromQueue() {
		if (!this.queue) return
		this.queue.actions.splice(this.queue.actions.indexOf(this), 1);
	}
}

export default BattleAction;