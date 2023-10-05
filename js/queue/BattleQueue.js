import Events from "../Events.js";
class BattleQueue {
    battle;
    actions = [];
    currentlyBeingExecuted = null;
    paused = false;
    eventHandler = new Events.Handler();
    constructor(battle) {
        this.battle = battle;
    }
    push(...actions) {
        actions.forEach(action => {
            action.queue = this;
            this.actions.push(action);
            action.eventHandler.dispatchEvent('add');
        });
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
            if (!this.paused)
                await this.executeNextActionThenRemove();
            else
                await this.eventHandler.awaitDispatch('resume');
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
