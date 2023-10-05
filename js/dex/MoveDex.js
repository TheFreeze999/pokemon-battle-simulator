import Move from "../Move.js";
import Type, { TypeUtils } from "../Type.js";
import BurnEffect from "../effects/effect_types/status_conditions/BurnEffect.js";
import DamageAction from "../queue/actions/DamageAction.js";
import EffectApplicationAction from "../queue/actions/EffectApplicationAction.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";
var MoveDex;
(function (MoveDex) {
    MoveDex.accelerock = new Move({
        name: "accelerock",
        displayName: "Accelerock",
        type: Type.ROCK,
        category: Move.Category.PHYSICAL,
        basePower: 40,
        accuracy: 100,
        contact: true,
        priority: 1
    });
    MoveDex.bite = new Move({
        name: "bite",
        displayName: "Bite",
        type: Type.DARK,
        category: Move.Category.PHYSICAL,
        basePower: 60,
        accuracy: 100,
        contact: true,
    });
    MoveDex.dragon_rage = new Move({
        name: "dragon_rage",
        displayName: "Dragon Rage",
        type: Type.DRAGON,
        category: Move.Category.SPECIAL,
        accuracy: 100,
        dealDirectDamage: false,
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
    MoveDex.energy_ball = new Move({
        name: "energy_ball",
        displayName: "Energy Ball",
        type: Type.GRASS,
        category: Move.Category.SPECIAL,
        basePower: 90,
        accuracy: 100,
        applySecondaryEffects(moveAction) {
            const statDropAction = new StatStageChangeAction(moveAction.target, "specialDefense", -1);
            statDropAction.chance = [10, 100];
            statDropAction.priority = 3;
            statDropAction.cause = moveAction;
            moveAction.target.battle?.queue.push(statDropAction);
        }
    });
    MoveDex.flamethrower = new Move({
        name: "flamethrower",
        displayName: "Flamethrower",
        type: Type.FIRE,
        category: Move.Category.SPECIAL,
        basePower: 90,
        accuracy: 100,
        applySecondaryEffects(moveAction) {
            const burnAction = new EffectApplicationAction(moveAction.target, new BurnEffect());
            burnAction.chance = [10, 100];
            burnAction.priority = 3;
            burnAction.cause = moveAction;
            moveAction.target.battle?.queue.push(burnAction);
        }
    });
    MoveDex.hone_claws = new Move({
        name: "hone_claws",
        displayName: "Hone Claws",
        type: Type.DARK,
        category: Move.Category.STATUS,
        accuracy: -1,
        applySecondaryEffects(moveAction) {
            const attackStatDropAction = new StatStageChangeAction(moveAction.user, "attack", 1);
            const accuracyStatDropAction = new StatStageChangeAction(moveAction.user, "accuracy", 1);
            attackStatDropAction.priority = 3;
            attackStatDropAction.cause = moveAction;
            accuracyStatDropAction.priority = 3;
            accuracyStatDropAction.cause = moveAction;
            moveAction.target.battle?.queue.push(attackStatDropAction, accuracyStatDropAction);
        }
    });
    MoveDex.metal_sound = new Move({
        name: "metal_sound",
        displayName: "Metal Sound",
        type: Type.STEEL,
        category: Move.Category.STATUS,
        accuracy: 85,
        applySecondaryEffects(moveAction) {
            const statDropAction = new StatStageChangeAction(moveAction.target, "specialDefense", -2);
            statDropAction.priority = 3;
            statDropAction.cause = moveAction;
            moveAction.target.battle?.queue.push(statDropAction);
        }
    });
    MoveDex.screech = new Move({
        name: "screech",
        displayName: "Screech",
        type: Type.NORMAL,
        category: Move.Category.STATUS,
        accuracy: 85,
        applySecondaryEffects(moveAction) {
            const statDropAction = new StatStageChangeAction(moveAction.target, "defense", -2);
            statDropAction.priority = 3;
            statDropAction.cause = moveAction;
            moveAction.target.battle?.queue.push(statDropAction);
        }
    });
    MoveDex.surf = new Move({
        name: "surf",
        displayName: "Surf",
        type: Type.WATER,
        category: Move.Category.SPECIAL,
        basePower: 90,
        accuracy: 100,
    });
    MoveDex.tackle = new Move({
        name: "tackle",
        displayName: "Tackle",
        type: Type.NORMAL,
        category: Move.Category.PHYSICAL,
        basePower: 55,
        accuracy: 100,
        contact: true
    });
    MoveDex.thunder_shock = new Move({
        name: "thunder_shock",
        displayName: "Thunder Shock",
        type: Type.ELECTRIC,
        category: Move.Category.SPECIAL,
        basePower: 40,
        accuracy: 100,
    });
    MoveDex.willowisp = new Move({
        name: "willowisp",
        displayName: "Will-O-Wisp",
        type: Type.FIRE,
        category: Move.Category.STATUS,
        accuracy: 85,
        applySecondaryEffects(moveAction) {
            const burnAction = new EffectApplicationAction(moveAction.target, new BurnEffect());
            burnAction.priority = 3;
            burnAction.cause = moveAction;
            moveAction.target.battle?.queue.push(burnAction);
        }
    });
})(MoveDex || (MoveDex = {}));
export default MoveDex;
