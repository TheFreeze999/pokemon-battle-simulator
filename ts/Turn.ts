import Battle from "./Battle.js";
import Battler from "./Battler.js";
import Events from "./Events.js";
import Move from "./Move.js";
import BattleAction from "./queue/BattleAction.js";
import MoveAction from "./queue/actions/MoveAction.js";

class Turn {
	private _phase = Turn.Phase.ACTION_SELECTION;
	battlerSelections = new Map<Battler, Turn.Selection>();
	eventHandler = new Events.Handler();

	constructor(public battle: Battle, public number: number) {

	}

	get phase() { return this._phase; }

	setPhase(newPhase: Turn.Phase) {
		const oldPhase = this._phase;
		this.eventHandler.dispatchEvent('phase change', { oldPhase, newPhase });
		this._phase = newPhase;
	}

	incrementPhase() {
		this.setPhase((this.phase + 1) % 3);
	}

	makeSelection(battler: Battler, selection: Turn.Selection) {
		this.battlerSelections.set(battler, selection);
	}

	async concludeActionSelectionPhase() {
		if (this.phase !== Turn.Phase.ACTION_SELECTION) return;
		this.incrementPhase();
		for (const [battler, selection] of this.battlerSelections) {
			if (battler !== selection.user) continue;

			let action: BattleAction;
			// if (selection.type === "move") {
			action = new MoveAction(selection.user, selection.target, selection.move);
			// }
			action.priority = Turn.Selection.getPriority(selection);
			selection.user.battle?.queue.push(action);
		}
		await this.battle.queue.executeAll();
	}

	async concludeMainActionPhase() {
		if (this.phase !== Turn.Phase.MAIN_ACTION) return;
		this.incrementPhase();


		const allBattlers = this.battle.allBattlers;
		for (const battler of allBattlers) {
			battler.ability.applyFinalPhaseBattleActions(battler);
			battler.heldItem?.applyFinalPhaseBattleActions(battler);

			for (const effect of battler.effects) {
				effect.applyFinalPhaseBattleActions(battler);
			}
		}
		await this.battle.queue.executeAll();
	}
	async concludeFinalPhase() {
		if (this.phase !== Turn.Phase.FINAL) return;
		this.battle.turn = new Turn(this.battle, this.number + 1);
		this.battle.eventHandler.dispatchEvent('new turn');
		await this.battle.renderer.showTextWhilePausingQueue("----------------------------", [], 2000);

		for (const team of this.battle.teams) {
			if (team.allBattlersFainted) {
				this.battle.winner = team.enemyTeam;
				this.battle.eventHandler.dispatchEvent('end')
				await this.battle.renderer.showTextWhilePausingQueue(`Team ${this.battle.winner.index} wins!`);
			}
		}
	}
}

namespace Turn {
	export enum Phase {
		ACTION_SELECTION,
		MAIN_ACTION,
		FINAL
	}

	export interface MoveSelection {
		type: 'move';
		user: Battler;
		target: Battler;
		move: Move;
	}

	export type Selection = MoveSelection;

	export namespace Selection {
		export function getPriority(selection: Selection): number {
			if (selection.type === "move") {
				if (!selection.user.battle) return 0;
				const movePriority = selection.move.priority;
				const switchedInBattlersSortedDesc = selection.user.battle.sortSwitchedInBattlersBySpeedDescending();
				const speedOrder = switchedInBattlersSortedDesc.toReversed().indexOf(selection.user);
				return (movePriority * 0.5) + (speedOrder * 0.1);
			}

			return 0;
		}
	}
}

export default Turn;