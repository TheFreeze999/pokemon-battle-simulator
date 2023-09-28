class BattleAction {
    queue = null;
    /* Highest first */
    priority = 0;
    removeSelfFromQueue() {
        if (!this.queue)
            return;
        this.queue.actions.splice(this.queue.actions.indexOf(this), 1);
    }
}
export default BattleAction;
