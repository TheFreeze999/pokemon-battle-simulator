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
        console.log(`${this.target.displayName} fainted!`);
        this.target.fainted = true;
    }
}
export default FaintAction;
