import Move from "../../Move.js";
import Type from "../../Type.js";
import MoveAction from "../../queue/actions/MoveAction.js";
import Effect from "../Effect.js";
class FlashFireEffect extends Effect {
    constructor() {
        super('flash_fire');
        this.eventHandler.addEventListener('application', (battler) => {
            console.log(`${battler.displayName}'s Fire-type moves were powered up.`);
        });
    }
    battleActionModifiers = [
        {
            priority: 0,
            modify(battleAction, owner) {
                if (!(battleAction instanceof MoveAction))
                    return;
                if (battleAction.user !== owner)
                    return;
                if (battleAction.move.type !== Type.FIRE)
                    return;
                if (battleAction.move.category === Move.Category.STATUS || !battleAction.move.dealDirectDamage)
                    return;
                battleAction.attackStatMultiplier *= 1.5;
            }
        }
    ];
}
export default FlashFireEffect;
