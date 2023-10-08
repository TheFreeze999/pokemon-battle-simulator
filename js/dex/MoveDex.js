import Move from "../Move.js";
import Type, { TypeUtils } from "../Type.js";
import BurnEffect from "../effects/effect_types/status_conditions/BurnEffect.js";
import DamageAction from "../queue/actions/DamageAction.js";
import EffectApplicationAction from "../queue/actions/EffectApplicationAction.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";
import RemoveItemAction from '../queue/actions/RemoveItemAction.js';
import GiveItemAction from "../queue/actions/GiveItemAction.js";
import HealAction from "../queue/actions/HealAction.js";
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
        priority: 1,
        pp: 20,
    });
    MoveDex.bite = new Move({
        name: "bite",
        displayName: "Bite",
        type: Type.DARK,
        category: Move.Category.PHYSICAL,
        basePower: 60,
        accuracy: 100,
        contact: true,
        pp: 25,
    });
    MoveDex.dragon_rage = new Move({
        name: "dragon_rage",
        displayName: "Dragon Rage",
        type: Type.DRAGON,
        category: Move.Category.SPECIAL,
        accuracy: 100,
        dealDirectDamage: false,
        pp: 10,
        applySecondaryEffects(moveAction) {
            if (TypeUtils.calculateEffectiveness([Type.DRAGON], moveAction.target.types) === 0) {
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
        pp: 10,
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
        pp: 15,
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
        pp: 15,
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
        pp: 40,
        applySecondaryEffects(moveAction) {
            const statDropAction = new StatStageChangeAction(moveAction.target, "specialDefense", -2);
            statDropAction.priority = 3;
            statDropAction.cause = moveAction;
            moveAction.target.battle?.queue.push(statDropAction);
        }
    });
    MoveDex.recover = new Move({
        name: "recover",
        displayName: "Recover",
        type: Type.NORMAL,
        category: Move.Category.STATUS,
        accuracy: -1,
        pp: 10,
        applySecondaryEffects(moveAction) {
            const healAmount = moveAction.user.initialStats.hp / 2;
            const healAction = new HealAction(moveAction.user, healAmount);
            healAction.priority = 3;
            healAction.cause = moveAction;
            moveAction.target.battle?.queue.push(healAction);
        }
    });
    MoveDex.screech = new Move({
        name: "screech",
        displayName: "Screech",
        type: Type.NORMAL,
        category: Move.Category.STATUS,
        accuracy: 85,
        pp: 40,
        applySecondaryEffects(moveAction) {
            const statDropAction = new StatStageChangeAction(moveAction.target, "defense", -2);
            statDropAction.priority = 3;
            statDropAction.cause = moveAction;
            moveAction.target.battle?.queue.push(statDropAction);
        }
    });
    MoveDex.shadow_sneak = new Move({
        name: "shadow_sneak",
        displayName: "Shadow Sneak",
        type: Type.GHOST,
        category: Move.Category.PHYSICAL,
        basePower: 40,
        accuracy: 100,
        contact: true,
        priority: 1,
        pp: 30,
    });
    MoveDex.struggle = new Move({
        name: "struggle",
        displayName: "Struggle",
        type: Type.NORMAL,
        category: Move.Category.PHYSICAL,
        basePower: 50,
        accuracy: -1,
        pp: -1,
        ignoreTypeEffectiveness: true,
        applySecondaryEffects(moveAction) {
            const recoilAmount = moveAction.user.initialStats.hp / 4;
            const recoilAction = new DamageAction(moveAction.user, recoilAmount);
            recoilAction.priority = 4;
            recoilAction.cause = moveAction;
            recoilAction.showText = false;
            recoilAction.showHpRemainingText = false;
            recoilAction.eventHandler.addEventListener('before execution', async () => {
                await moveAction.queue?.battle.renderer.showTextWhilePausingQueue(`${moveAction.user.displayName} lost some HP due to recoil.`);
            });
            moveAction.target.battle?.queue.push(recoilAction);
        }
    });
    MoveDex.surf = new Move({
        name: "surf",
        displayName: "Surf",
        type: Type.WATER,
        category: Move.Category.SPECIAL,
        basePower: 90,
        accuracy: 100,
        pp: 15,
    });
    MoveDex.tackle = new Move({
        name: "tackle",
        displayName: "Tackle",
        type: Type.NORMAL,
        category: Move.Category.PHYSICAL,
        basePower: 55,
        accuracy: 100,
        contact: true,
        pp: 35,
    });
    MoveDex.thunder_shock = new Move({
        name: "thunder_shock",
        displayName: "Thunder Shock",
        type: Type.ELECTRIC,
        category: Move.Category.SPECIAL,
        basePower: 40,
        accuracy: 100,
        pp: 30,
    });
    MoveDex.trick = new Move({
        name: "trick",
        displayName: "Trick",
        type: Type.PSYCHIC,
        category: Move.Category.STATUS,
        accuracy: 100,
        pp: 10,
        async applySecondaryEffects(moveAction) {
            if (moveAction.user === moveAction.target)
                return;
            const userItem = moveAction.user.heldItem;
            const targetItem = moveAction.target.heldItem;
            const userItemRemovalAction = new RemoveItemAction(moveAction.user);
            const targetItemRemovalAction = new RemoveItemAction(moveAction.target);
            userItemRemovalAction.priority = 3.1;
            targetItemRemovalAction.priority = 3.1;
            userItemRemovalAction.showText = false;
            targetItemRemovalAction.showText = false;
            moveAction.queue?.push(userItemRemovalAction, targetItemRemovalAction);
            if (targetItem) {
                const userItemGiveAction = new GiveItemAction(moveAction.user, targetItem);
                userItemGiveAction.priority = 3;
                moveAction.queue?.push(userItemGiveAction);
            }
            if (userItem) {
                const targetItemGiveAction = new GiveItemAction(moveAction.target, userItem);
                targetItemGiveAction.priority = 3;
                moveAction.queue?.push(targetItemGiveAction);
            }
        }
    });
    MoveDex.willowisp = new Move({
        name: "willowisp",
        displayName: "Will-O-Wisp",
        type: Type.FIRE,
        category: Move.Category.STATUS,
        accuracy: 85,
        pp: 15,
        applySecondaryEffects(moveAction) {
            const burnAction = new EffectApplicationAction(moveAction.target, new BurnEffect());
            burnAction.priority = 3;
            burnAction.cause = moveAction;
            moveAction.target.battle?.queue.push(burnAction);
        }
    });
})(MoveDex || (MoveDex = {}));
export default MoveDex;
