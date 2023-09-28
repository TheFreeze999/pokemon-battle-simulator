import BattleAction from "../BattleAction.js";
class FaintAction extends BattleAction {
    target;
    constructor(target) {
        super();
        this.target = target;
    }
    async execute() {
        console.log(`${this.target.name} fainted!`);
        this.target.fainted = true;
    }
}
export default FaintAction;
