import Move from "../Move.js";
import HealAction from "../queue/actions/HealAction.js";
import MoveAction from "../queue/actions/MoveAction.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";
var AbilityPresets;
(function (AbilityPresets) {
    function immunityToTypeWithHealing(ability, type, healAmountPercentage) {
        const ACTIVATED = Symbol(`${ability.name} ACTIVATED`);
        ability.preExecutionModifiers.push({
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
                if (battleAction.move.type !== type)
                    return;
                battleAction.flags[ACTIVATED] = true;
                battleAction.skipDamageCalcPhase = true;
                battleAction.performSecondaryEffects = false;
            },
        });
        ability.postExecutionModifiers.push({
            priority: 0,
            async modify(battleAction, owner) {
                if (!(battleAction instanceof MoveAction))
                    return;
                if (!battleAction.targets.includes(owner))
                    return;
                if (battleAction.flags[ACTIVATED] !== true)
                    return;
                const healAction = new HealAction(owner, owner.initialStats.hp * healAmountPercentage / 100);
                healAction.priority = 45;
                healAction.cause = battleAction;
                await battleAction.queue?.battle.renderer.showTextWhilePausingQueue(`[${owner.displayName}'s ${ability.displayName}]`, ['ability'], 1000);
                battleAction.queue?.push(healAction);
            },
        });
    }
    AbilityPresets.immunityToTypeWithHealing = immunityToTypeWithHealing;
    function immunityToTypeWithStatBoost(ability, type, stat, amount) {
        const ACTIVATED = Symbol(`${ability.name} ACTIVATED`);
        ability.preExecutionModifiers.push({
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
                if (battleAction.move.type !== type)
                    return;
                battleAction.flags[ACTIVATED] = true;
                battleAction.skipDamageCalcPhase = true;
                battleAction.performSecondaryEffects = false;
            },
        });
        ability.postExecutionModifiers.push({
            priority: 0,
            async modify(battleAction, owner) {
                if (!(battleAction instanceof MoveAction))
                    return;
                if (!battleAction.targets.includes(owner))
                    return;
                if (battleAction.flags[ACTIVATED] !== true)
                    return;
                const statBoostAction = new StatStageChangeAction(owner, stat, amount);
                statBoostAction.priority = 45;
                statBoostAction.cause = battleAction;
                await battleAction.queue?.battle.renderer.showTextWhilePausingQueue(`[${owner.displayName}'s ${ability.displayName}]`, ['ability'], 1000);
                battleAction.queue?.push(statBoostAction);
            },
        });
    }
    AbilityPresets.immunityToTypeWithStatBoost = immunityToTypeWithStatBoost;
    function powerBoostWithTypeWhenLowHP(ability, type, hpPercentageThreshold) {
        ability.preExecutionModifiers.push({
            priority: 0,
            async modify(battleAction, owner) {
                if (!(battleAction instanceof MoveAction))
                    return;
                if (battleAction.user !== owner)
                    return;
                if (battleAction.move.targeting !== Move.Targeting.ONE_OTHER)
                    return;
                if (battleAction.move.type !== type)
                    return;
                if (owner.hpPercentage > hpPercentageThreshold)
                    return;
                battleAction.attackStatMultiplier *= 1.5;
            },
        });
    }
    AbilityPresets.powerBoostWithTypeWhenLowHP = powerBoostWithTypeWhenLowHP;
})(AbilityPresets || (AbilityPresets = {}));
export default AbilityPresets;
