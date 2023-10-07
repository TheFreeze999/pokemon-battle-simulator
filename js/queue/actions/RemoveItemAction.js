import BattleAction from "../BattleAction.js";
class RemoveItemAction extends BattleAction {
    target;
    showText = true;
    constructor(target) {
        super();
        this.target = target;
    }
    clause() {
        if (this.target.fainted)
            return false;
        if (!this.target.heldItem)
            return false;
        return true;
    }
    async execute() {
        if (this.showText)
            await this.queue?.battle.renderer.showTextWhilePausingQueue(`${this.target.displayName}'s ${this.target.heldItem?.displayName} was removed.`);
        this.target.heldItem = null;
    }
}
export default RemoveItemAction;
