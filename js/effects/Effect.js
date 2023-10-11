import Events from "../Events.js";
class Effect {
    type;
    host = null;
    eventHandler = new Events.Handler();
    preExecutionModifiers = [];
    postExecutionModifiers = [];
    canBeAppliedOnFaintedBattler = false;
    stackable = false;
    constructor(type) {
        this.type = type;
    }
    applyPreStartPhaseBattleActions(owner) { }
    applyFinalPhaseBattleActions(owner) { }
    isImmune(battler) { return false; }
}
export default Effect;
