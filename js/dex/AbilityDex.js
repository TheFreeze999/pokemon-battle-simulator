import Ability from "../Ability.js";
import Move from "../Move.js";
import Type from "../Type.js";
import HealAction from "../queue/actions/HealAction.js";
import MoveAction from "../queue/actions/MoveAction.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";
var AbilityDex;
(function (AbilityDex) {
    AbilityDex.no_ability = new Ability({
        name: "no_ability",
        displayName: "No Ability"
    });
    AbilityDex.contrary = new Ability({
        name: "contrary",
        displayName: "Contrary",
        preExecutionModifiers: [
            {
                priority: 0,
                async modify(battleAction, owner) {
                    if (!(battleAction instanceof StatStageChangeAction))
                        return;
                    if (battleAction.target !== owner)
                        return;
                    battleAction.amount *= -1;
                },
            }
        ]
    });
    AbilityDex.intimidate = new Ability({
        name: "intimidate",
        displayName: "Intimidate",
        applyPreStartPhaseBattleActions(owner) {
            const target = owner.team?.enemyTeam.switchedInBattler;
            if (!target)
                return;
            const statStageChangeAction = new StatStageChangeAction(target, "attack", -1);
            statStageChangeAction.priority = 30;
            statStageChangeAction.eventHandler.addEventListener('before execution', async () => {
                await owner.battle?.renderer.showTextWhilePausingQueue(`[${owner.displayName}'s Intimidate]`, ["ability"]);
            });
            owner.battle?.queue.push(statStageChangeAction);
        },
    });
    AbilityDex.overgrow = new Ability({
        name: "overgrow",
        displayName: "Overgrow",
        preExecutionModifiers: [
            {
                priority: 0,
                async modify(battleAction, owner) {
                    if (!(battleAction instanceof MoveAction))
                        return;
                    if (battleAction.user !== owner)
                        return;
                    if (battleAction.move.targeting !== Move.Targeting.ONE_OTHER)
                        return;
                    if (battleAction.move.type !== Type.GRASS)
                        return;
                    if (owner.hpPercentage > (100 / 3))
                        return;
                    battleAction.attackStatMultiplier *= 1.5;
                },
            }
        ]
    });
    AbilityDex.simple = new Ability({
        name: "simple",
        displayName: "Simple",
        preExecutionModifiers: [
            {
                priority: 0,
                async modify(battleAction, owner) {
                    if (!(battleAction instanceof StatStageChangeAction))
                        return;
                    if (battleAction.target !== owner)
                        return;
                    battleAction.amount *= 2;
                },
            }
        ]
    });
    const VOLT_ABSORB_ACTIVATED = Symbol('VOLT_ABSORB_ACTIVATED');
    AbilityDex.volt_absorb = new Ability({
        name: "volt_absorb",
        displayName: "Volt Absorb",
        preExecutionModifiers: [
            {
                priority: 0,
                async modify(battleAction, owner) {
                    if (!(battleAction instanceof MoveAction))
                        return;
                    if (battleAction.move.targeting !== Move.Targeting.ONE_OTHER)
                        return;
                    if (!battleAction.targets.includes(owner))
                        return;
                    if (battleAction.move.type !== Type.ELECTRIC)
                        return;
                    battleAction.flags[VOLT_ABSORB_ACTIVATED] = true;
                    battleAction.skipDamageCalcPhase = true;
                    battleAction.performSecondaryEffects = false;
                },
            }
        ],
        postExecutionModifiers: [
            {
                priority: 0,
                async modify(battleAction, owner) {
                    if (!(battleAction instanceof MoveAction))
                        return;
                    if (!battleAction.targets.includes(owner))
                        return;
                    if (battleAction.flags[VOLT_ABSORB_ACTIVATED] !== true)
                        return;
                    const healAction = new HealAction(owner, owner.initialStats.hp / 4);
                    healAction.priority = 45;
                    healAction.cause = battleAction;
                    await battleAction.queue?.battle.renderer.showTextWhilePausingQueue(`[${owner.displayName}'s Volt Absorb]`, ['ability'], 1000);
                    battleAction.queue?.push(healAction);
                },
            }
        ]
    });
})(AbilityDex || (AbilityDex = {}));
export default AbilityDex;
