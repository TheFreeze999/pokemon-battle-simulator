class BattleQueue {
    battle;
    actions = [];
    currentlyBeingExecuted = null;
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
            await this.executeNextActionThenRemove();
        }
    }
}
export default BattleQueue;
