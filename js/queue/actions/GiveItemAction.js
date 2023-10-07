import BattleAction from "../BattleAction.js";
class GiveItemAction extends BattleAction {
    target;
    item;
    showText = true;
    constructor(target, item) {
        super();
        this.target = target;
        this.item = item;
    }
    clause() {
        if (this.target.fainted)
            return false;
        if (this.target.heldItem)
            return false;
        return true;
    }
    async execute() {
        if (this.showText)
            await this.queue?.battle.renderer.showTextWhilePausingQueue(`${this.target.displayName}'s received a ${this.item.displayName}!`);
        this.target.heldItem = this.item;
    }
}
export default GiveItemAction;
