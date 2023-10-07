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
}
export default Effect;
