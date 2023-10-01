import BattleAction from "../BattleAction.js";
class EffectApplicationAction extends BattleAction {
    target;
    effect;
    reasonText = null;
    constructor(target, effect) {
        super();
        this.target = target;
        this.effect = effect;
    }
    clause() {
        if (!this.effect.canBeAppliedOnFaintedBattler && this.target.fainted)
            return false;
        if (!this.effect.stackable && this.target.hasEffect(this.effect.type))
            return false;
        return true;
    }
    async execute() {
        if (this.reasonText)
            console.log(this.reasonText);
        this.effect.eventHandler.dispatchEvent('application', this.target);
        this.target.addEffect(this.effect);
    }
}
export default EffectApplicationAction;
