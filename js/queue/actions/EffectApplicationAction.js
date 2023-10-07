import BattleAction from "../BattleAction.js";
class EffectApplicationAction extends BattleAction {
    target;
    effect;
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
        if (this.effect.isImmune(this.target))
            return;
        this.target.addEffect(this.effect);
    }
}
export default EffectApplicationAction;
