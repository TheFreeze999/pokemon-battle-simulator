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
    applyFinalPhaseBattleActions(owner) { }
    isImmune(battler) { return false; }
}
export default Effect;
