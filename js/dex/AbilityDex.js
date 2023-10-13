import Ability from "../Ability.js";
import Move from "../Move.js";
import Type from "../Type.js";
import HealAction from "../queue/actions/HealAction.js";
import MoveAction from "../queue/actions/MoveAction.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";
import SwitchInAction from "../queue/actions/SwitchInAction.js";
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
        postExecutionModifiers: [
            {
                priority: 0,
                async modify(battleAction, owner) {
                    if (!(battleAction instanceof SwitchInAction))
                        return;
                    if (battleAction.target !== owner)
                        return;
                    const foes = battleAction.target.foes;
                    for (const foe of foes) {
                        const intimidateAction = new StatStageChangeAction(foe, "attack", -1);
                        intimidateAction.priority = 30;
                        intimidateAction.eventHandler.addEventListener('before execution', async () => {
                            await owner.battle?.renderer.showTextWhilePausingQueue(`[${owner.displayName}'s Intimidate]`, ["ability"]);
                        });
                        owner.battle?.queue.push(intimidateAction);
                    }
                },
            }
        ]
    });
    AbilityDex.no_guard = new Ability({
        name: "no_guard",
        displayName: "No Guard",
        preExecutionModifiers: [
            {
                priority: 0,
                async modify(battleAction, owner) {
                    if (!(battleAction instanceof MoveAction))
                        return;
                    console.log(`user: ${battleAction.user.displayName}, targets: ${battleAction.targets.map(t => t.displayName)}`);
                    if (battleAction.user === owner) {
                        for (const target of battleAction.targets) {
                            battleAction.forceMoveHitOnTargets.set(target, true);
                        }
                    }
                    if (battleAction.targets.includes(owner)) {
                        battleAction.forceMoveHitOnTargets.set(owner, true);
                    }
                    console.log(battleAction.forceMoveHitOnTargets);
                },
            }
        ]
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
    const SAP_SIPPER_ACTIVATED = Symbol('SAP_SIPPER_ACTIVATED');
    AbilityDex.sap_sipper = new Ability({
        name: "sap_sipper",
        displayName: "Sap Sipper",
        preExecutionModifiers: [
            {
                priority: 0,
                async modify(battleAction, owner) {
                    if (!(battleAction instanceof MoveAction))
                        return;
                    if (battleAction.move.targeting === Move.Targeting.SELF)
                        return;
                    if (battleAction.move.targeting === Move.Targeting.NONE)
                        return;
                    if (!battleAction.targets.includes(owner))
                        return;
                    if (battleAction.move.type !== Type.GRASS)
                        return;
                    battleAction.flags[SAP_SIPPER_ACTIVATED] = true;
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
                    if (battleAction.flags[SAP_SIPPER_ACTIVATED] !== true)
                        return;
                    const statBoostAction = new StatStageChangeAction(owner, "attack", 1);
                    statBoostAction.priority = 45;
                    statBoostAction.cause = battleAction;
                    await battleAction.queue?.battle.renderer.showTextWhilePausingQueue(`[${owner.displayName}'s Sap Sipper]`, ['ability'], 1000);
                    battleAction.queue?.push(statBoostAction);
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
                    if (battleAction.move.targeting === Move.Targeting.SELF)
                        return;
                    if (battleAction.move.targeting === Move.Targeting.NONE)
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
