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

	/** The BattleAction will not be modified or executed if this function returns false */
	clause() { return true; };

	protected abstract execute(): Promise<void>;

	async modifyThenExecuteIfAllowed() {
		if (!this.clause()) return;
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
		const battlerModifierPairs: { battler: Battler, modifier: BattleAction.Modifier }[] = [];
		for (const battler of allBattlers) {
			for (const modifier of battler.ability.battleActionModifiers) {
				battlerModifierPairs.push({ battler, modifier });
			}

			for (const effect of battler.effects) {
				for (const modifier of effect.battleActionModifiers) {
					battlerModifierPairs.push({ battler, modifier });
				}
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

namespace BattleAction {
	export interface Modifier {
		/** Highest first */
		priority: number;
		modify(battleAction: BattleAction, owner: Battler): void;
	}
}

export default BattleAction;