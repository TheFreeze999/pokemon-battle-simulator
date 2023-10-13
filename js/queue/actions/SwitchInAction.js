import BattleAction from "../BattleAction.js";
class SwitchInAction extends BattleAction {
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
        if (!this.target.team)
            return;
        this.target.team.switchedInBattler = this.target;
        await this.target.battle?.renderer.showTextWhilePausingQueue(`Team ${this.target.team.index} send out ${this.target.displayName}!`);
    }
}
export default SwitchInAction;
