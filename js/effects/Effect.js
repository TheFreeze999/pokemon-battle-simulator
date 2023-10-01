import Events from "../Events.js";
class Effect {
    type;
    host = null;
    eventHandler = new Events.Handler();
    battleActionModifiers = [];
    canBeAppliedOnFaintedBattler = false;
    stackable = false;
    constructor(type) {
        this.type = type;
    }
}
export default Effect;
