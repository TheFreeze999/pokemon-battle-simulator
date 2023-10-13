import Events from "./Events.js";
import MoveAction from "./queue/actions/MoveAction.js";
import SwitchInAction from "./queue/actions/SwitchInAction.js";
import { delay, randomArrayElement } from "./util.js";
class Turn {
    battle;
    number;
    _phase;
    battlerSelections = new Map();
    eventHandler = new Events.Handler();
    constructor(battle, number) {
        this.battle = battle;
        this.number = number;
        this._phase = this.number === 1 ? Turn.Phase.PRE_START : Turn.Phase.ACTION_SELECTION;
    }
    get phase() { return this._phase; }
    setPhase(newPhase) {
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
    makeSelection(battler, selection) {
        this.battlerSelections.set(battler, selection);
    }
    async performPreStartPhase() {
        if (this.phase !== Turn.Phase.PRE_START)
            return;
        const allSwitchedIn = this.battle.allSwitchedIn;
        for (const battler of allSwitchedIn) {
            const switchInAction = new SwitchInAction(battler);
            switchInAction.priority = 100 - battler.placeInSpeedOrder;
            this.battle.queue.push(switchInAction);
        }
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
        this.incrementPhase();
    }
    async performActionSelectionPhase() {
        if (this.phase !== Turn.Phase.ACTION_SELECTION)
            return;
        this.incrementPhase();
    }
    async performMainActionPhase() {
        if (this.phase !== Turn.Phase.MAIN_ACTION)
            return;
        for (const [battler, selection] of this.battlerSelections) {
            if (battler !== selection.user)
                continue;
            let action;
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
        if (this.phase !== Turn.Phase.FINAL)
            return;
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
                this.battle.eventHandler.dispatchEvent('end');
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
            if (aSpeed === bSpeed)
                return randomArrayElement([1, -1]);
            return bSpeed - aSpeed;
        });
    }
}
(function (Turn) {
    let Phase;
    (function (Phase) {
        /** Happens once at the very start of the battle, before players select what to do. This is where e.g. Intimidate activates */
        Phase[Phase["PRE_START"] = 0] = "PRE_START";
        /** During this phase, the players choose what to do. This includes what moves to use, switches to make, items to use etc. */
        Phase[Phase["ACTION_SELECTION"] = 1] = "ACTION_SELECTION";
        /** This is where the main actions (which were directly/indirectly caused by the players' choices in the `ACTION_SELECTION` phase) take place*/
        Phase[Phase["MAIN_ACTION"] = 2] = "MAIN_ACTION";
        /** This phase is for the actions which take place at the very end of the round, e.g. burn damage*/
        Phase[Phase["FINAL"] = 3] = "FINAL";
    })(Phase = Turn.Phase || (Turn.Phase = {}));
    let Selection;
    (function (Selection) {
        function getPriority(selection) {
            if (selection.type === "move") {
                if (!selection.user.battle)
                    return 0;
                const movePriority = selection.move.priority;
                // move priority will be between -7 and 6
                // user acting priority will be between -0.1 and 0
                // this value will be between -3.6 and 3
                return (movePriority * 0.5) + selection.user.actingPriority;
            }
            return 0;
        }
        Selection.getPriority = getPriority;
    })(Selection = Turn.Selection || (Turn.Selection = {}));
})(Turn || (Turn = {}));
export default Turn;
