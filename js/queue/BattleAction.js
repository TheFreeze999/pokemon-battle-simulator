import { randomInteger } from "../util.js";
class BattleAction {
    queue = null;
    /* Highest first */
    priority = 0;
    toExecute = true;
    chance = [100, 100];
    executionStarted = false;
    cause = null;
    flags = {};
    /** The BattleAction will not be modified or executed if this function returns false */
    clause() { return true; }
    ;
    async modifyThenExecuteIfAllowed() {
        if (!this.clause())
            return;
        this.applyModificationsToSelf();
        if (!this.toExecute)
            return;
        const [selected, total] = this.chance;
        const randomNum = randomInteger(1, total);
        if (randomNum > selected)
            return;
        this.executionStarted = true;
        await this.execute();
    }
    async applyModificationsToSelf() {
        if (!this.queue)
            return;
        const allBattlers = this.queue.battle.allBattlers;
        const battlerModifierPairs = [];
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
            modifier.modify(this, battler);
        }
    }
    removeSelfFromQueue() {
        if (!this.queue)
            return;
        this.queue.actions.splice(this.queue.actions.indexOf(this), 1);
    }
}
export default BattleAction;
