import Ability from "../Ability.js";
import Move from "../Move.js";
import Type from "../Type.js";
import HealAction from "../queue/actions/HealAction.js";
import MoveAction from "../queue/actions/MoveAction.js";
var AbilityDex;
(function (AbilityDex) {
    AbilityDex.no_ability = new Ability({
        name: "no_ability",
        displayName: "No Ability"
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
                    await battleAction.queue?.battle.renderer.showTextWhilePausingQueue(`[${owner.displayName}'s Volt Absorb]`, ['ability'], 2000);
                    battleAction.queue?.push(healAction);
                },
            }
        ]
    });
})(AbilityDex || (AbilityDex = {}));
export default AbilityDex;
