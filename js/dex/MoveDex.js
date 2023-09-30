import Move from "../Move.js";
import Type, { TypeUtils } from "../Type.js";
import DamageAction from "../queue/actions/DamageAction.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";
var MoveDex;
(function (MoveDex) {
    MoveDex.tackle = new Move({
        name: "tackle",
        displayName: "Tackle",
        type: Type.NORMAL,
        category: Move.Category.PHYSICAL,
        basePower: 55
    });
    MoveDex.flamethrower = new Move({
        name: "flamethrower",
        displayName: "Flamethrower",
        type: Type.FIRE,
        category: Move.Category.SPECIAL,
        basePower: 90
    });
    MoveDex.energy_ball = new Move({
        name: "energy_ball",
        displayName: "Energy Ball",
        type: Type.GRASS,
        category: Move.Category.SPECIAL,
        basePower: 90,
        applySecondaryEffects(moveAction) {
            const statDropAction = new StatStageChangeAction(moveAction.target, "specialDefense", -1);
            statDropAction.chance = [100, 100];
            statDropAction.priority = 3;
            statDropAction.cause = moveAction;
            moveAction.target.battle?.queue.push(statDropAction);
        }
    });
    MoveDex.dragon_rage = new Move({
        name: "dragon_rage",
        displayName: "Dragon Rage",
        type: Type.DRAGON,
        category: Move.Category.SPECIAL,
        applySecondaryEffects(moveAction) {
            if (TypeUtils.calculateEffectiveness([Type.DRAGON], moveAction.target.types) === 0) {
                console.log(TypeUtils.getInfoFromEffectiveness(0));
                return;
            }
            const damageAction = new DamageAction(moveAction.target, 40);
            damageAction.priority = 5;
            damageAction.cause = moveAction;
            moveAction.target.battle?.queue.push(damageAction);
        }
    });
})(MoveDex || (MoveDex = {}));
export default MoveDex;
