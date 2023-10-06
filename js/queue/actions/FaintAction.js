import BattleAction from "../BattleAction.js";
class FaintAction extends BattleAction {
    target;
    constructor(target) {
        super();
        this.target = target;
    }
    clause() {
        if (this.target.fainted)
            return false;
        return true;
    }
    async execute() {
        await this.queue?.battle.renderer.showTextWhilePausingQueue(`${this.target.displayName} fainted!`);
        this.target.fainted = true;
    }
}
export default FaintAction;
