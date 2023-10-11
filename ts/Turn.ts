import Battle from "./Battle.js";
import Battler from "./Battler.js";
import Events from "./Events.js";
import Move from "./Move.js";
import BattleAction from "./queue/BattleAction.js";
import MoveAction from "./queue/actions/MoveAction.js";
import { delay, randomArrayElement } from "./util.js";

class Turn {
	private _phase: Turn.Phase;
	battlerSelections = new Map<Battler, Turn.Selection>();
	eventHandler = new Events.Handler();

	constructor(public battle: Battle, public number: number) {
		this._phase = this.number === 1 ? Turn.Phase.PRE_START : Turn.Phase.ACTION_SELECTION;
	}

	get phase() { return this._phase; }

	setPhase(newPhase: Turn.Phase) {
		const oldPhase = this._phase;
		this.eventHandler.dispatchEvent('phase change', { oldPhase, newPhase });
		this._phase = newPhase;
	}

	incrementPhase() {
		if (this.phase === Turn.Phase.FINAL)
			this.setPhase(Turn.Phase.ACTION_SELECTION);
		else
			this.setPhase((this.phase + 1) % 4);
	}

	makeSelection(battler: Battler, selection: Turn.Selection) {
		this.battlerSelections.set(battler, selection);
	}

	async performPreStartPhase() {
		if (this.phase !== Turn.Phase.PRE_START) return;
		const allBattlers = this.battle.allBattlers;
		for (const battler of allBattlers) {
			battler.ability.applyPreStartPhaseBattleActions(battler);
			battler.heldItem?.applyPreStartPhaseBattleActions(battler);

			for (const effect of battler.effects) {
				effect.applyPreStartPhaseBattleActions(battler);
			}
		}
		await this.battle.queue.executeAll();
		this.battle.renderer.showTextWhilePausingQueue("~~~~~~~~~~~~~~~~~~~~~~~~~~");
		await delay(500);
		this.incrementPhase()
	}

	async performActionSelectionPhase() {
		if (this.phase !== Turn.Phase.ACTION_SELECTION) return;
		this.incrementPhase();
	}

	async performMainActionPhase() {
		if (this.phase !== Turn.Phase.MAIN_ACTION) return;
		for (const [battler, selection] of this.battlerSelections) {
			if (battler !== selection.user) continue;

			let action: BattleAction;
			// if (selection.type === "move") {
			action = new MoveAction(selection.user, selection.targets, selection.move);
			// }
			action.priority = Turn.Selection.getPriority(selection);
			selection.user.battle?.queue.push(action);
		}
		await this.battle.queue.executeAll();
		this.incrementPhase();
	}

	async performFinalPhase() {
		if (this.phase !== Turn.Phase.FINAL) return;

		const allBattlers = this.battle.allBattlers;
		for (const battler of allBattlers) {
			battler.ability.applyFinalPhaseBattleActions(battler);
			battler.heldItem?.applyFinalPhaseBattleActions(battler);

			for (const effect of battler.effects) {
				effect.applyFinalPhaseBattleActions(battler);
			}
		}
		await this.battle.queue.executeAll();

		await this.battle.renderer.showTextWhilePausingQueue("----------------------------", [], 2000);

		for (const team of this.battle.teams) {
			if (team.allBattlersFainted) {
				this.battle.winner = team.enemyTeam;
				this.battle.eventHandler.dispatchEvent('end')
				await this.battle.renderer.showTextWhilePausingQueue(`Team ${this.battle.winner.index} wins!`);
				return;
			}
		}
		this.battle.turn = new Turn(this.battle, this.number + 1);
		this.battle.eventHandler.dispatchEvent('new turn');
		this.battle.renderer.updateTurnEl();
	}

	get speedOrderDesc() {
		return this.battle.allSwitchedIn.toSorted((a, b) => {
			const aSpeed = a.getEffectiveStats().speed;
			const bSpeed = b.getEffectiveStats().speed;
			if (aSpeed === bSpeed) return randomArrayElement([1, -1]);
			return bSpeed - aSpeed;
		});
	}
}

namespace Turn {
	export enum Phase {
		/** Happens once at the very start of the battle, before players select what to do. This is where e.g. Intimidate activates */
		PRE_START,
		/** During this phase, the players choose what to do. This includes what moves to use, switches to make, items to use etc. */
		ACTION_SELECTION,
		/** This is where the main actions (which were directly/indirectly caused by the players' choices in the `ACTION_SELECTION` phase) take place*/
		MAIN_ACTION,
		/** This phase is for the actions which take place at the very end of the round, e.g. burn damage*/
		FINAL
	}

	export interface MoveSelection {
		type: 'move';
		user: Battler;
		targets: Battler[];
		move: Move;
	}

	export type Selection = MoveSelection;

	export namespace Selection {
		export function getPriority(selection: Selection): number {
			if (selection.type === "move") {
				if (!selection.user.battle) return 0;
				const movePriority = selection.move.priority;

				// move priority will be between -7 and 6
				// user acting priority will be between -0.1 and 0
				// this value will be between -3.6 and 3
				return (movePriority * 0.5) + selection.user.actingPriority;
			}

			return 0;
		}
	}
}

export default Turn;