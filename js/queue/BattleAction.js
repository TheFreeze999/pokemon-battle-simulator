import { randomInteger } from "../util.js";
class BattleAction {
    queue = null;
    /* Highest first */
    priority = 0;
    toExecute = true;
    chance = [100, 100];
    executionStarted = false;
    async executeIfAllowed() {
        if (!this.toExecute)
            return;
        const [selected, total] = this.chance;
        const randomNum = randomInteger(1, total);
        if (randomNum > selected)
            return;
        this.executionStarted = true;
        await this.execute();
    }
    removeSelfFromQueue() {
        if (!this.queue)
            return;
        this.queue.actions.splice(this.queue.actions.indexOf(this), 1);
    }
}
export default BattleAction;
