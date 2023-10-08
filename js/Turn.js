import Events from "./Events.js";
import MoveAction from "./queue/actions/MoveAction.js";
class Turn {
    battle;
    number;
    _phase = Turn.Phase.ACTION_SELECTION;
    battlerSelections = new Map();
    eventHandler = new Events.Handler();
    constructor(battle, number) {
        this.battle = battle;
        this.number = number;
    }
    get phase() { return this._phase; }
    setPhase(newPhase) {
        const oldPhase = this._phase;
        this.eventHandler.dispatchEvent('phase change', { oldPhase, newPhase });
        this._phase = newPhase;
    }
    incrementPhase() {
        this.setPhase((this.phase + 1) % 3);
    }
    makeSelection(battler, selection) {
        this.battlerSelections.set(battler, selection);
    }
    async concludeActionSelectionPhase() {
        if (this.phase !== Turn.Phase.ACTION_SELECTION)
            return;
        this.incrementPhase();
        for (const [battler, selection] of this.battlerSelections) {
            if (battler !== selection.user)
                continue;
            let action;
            // if (selection.type === "move") {
            action = new MoveAction(selection.user, selection.target, selection.move);
            // }
            action.priority = Turn.Selection.getPriority(selection);
            selection.user.battle?.queue.push(action);
        }
        await this.battle.queue.executeAll();
    }
    async concludeMainActionPhase() {
        if (this.phase !== Turn.Phase.MAIN_ACTION)
            return;
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
        if (this.phase !== Turn.Phase.FINAL)
            return;
        await this.battle.renderer.showTextWhilePausingQueue("----------------------------", [], 2000);
        for (const team of this.battle.teams) {
            if (team.allBattlersFainted) {
                this.battle.winner = team.enemyTeam;
                this.battle.eventHandler.dispatchEvent('end');
                await this.battle.renderer.showTextWhilePausingQueue(`Team ${this.battle.winner.index} wins!`);
                return;
            }
        }
        this.battle.turn = new Turn(this.battle, this.number + 1);
        this.battle.eventHandler.dispatchEvent('new turn');
        this.battle.renderer.updateTurnEl();
    }
}
(function (Turn) {
    let Phase;
    (function (Phase) {
        Phase[Phase["ACTION_SELECTION"] = 0] = "ACTION_SELECTION";
        Phase[Phase["MAIN_ACTION"] = 1] = "MAIN_ACTION";
        Phase[Phase["FINAL"] = 2] = "FINAL";
    })(Phase = Turn.Phase || (Turn.Phase = {}));
    let Selection;
    (function (Selection) {
        function getPriority(selection) {
            if (selection.type === "move") {
                if (!selection.user.battle)
                    return 0;
                const movePriority = selection.move.priority;
                const switchedInBattlersSortedDesc = selection.user.battle.sortSwitchedInBattlersBySpeedDescending();
                const speedOrder = switchedInBattlersSortedDesc.toReversed().indexOf(selection.user);
                return (movePriority * 0.5) + (speedOrder * 0.1);
            }
            return 0;
        }
        Selection.getPriority = getPriority;
    })(Selection = Turn.Selection || (Turn.Selection = {}));
})(Turn || (Turn = {}));
export default Turn;
