import Ability from "../Ability.js";
import Type from "../Type.js";
import MoveAction from "../queue/actions/MoveAction.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";
import SwitchInAction from "../queue/actions/SwitchInAction.js";
import AbilityPresets from "./AbilityPresets.js";
var AbilityDex;
(function (AbilityDex) {
    AbilityDex.no_ability = new Ability({
        name: "no_ability",
        displayName: "No Ability"
    });
    AbilityDex.blaze = new Ability({
        name: "blaze",
        displayName: "Blaze"
    });
    AbilityPresets.powerBoostWithTypeWhenLowHP(AbilityDex.blaze, Type.FIRE, 100 / 3);
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
                        intimidateAction.priority = 30 - owner.placeInSpeedOrder;
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
        displayName: "Overgrow"
    });
    AbilityPresets.powerBoostWithTypeWhenLowHP(AbilityDex.overgrow, Type.GRASS, 100 / 3);
    AbilityDex.sap_sipper = new Ability({
        name: "sap_sipper",
        displayName: "Sap Sipper"
    });
    AbilityPresets.immunityToTypeWithStatBoost(AbilityDex.sap_sipper, Type.GRASS, "attack", 1);
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
    AbilityDex.torrent = new Ability({
        name: "torrent",
        displayName: "Torrent"
    });
    AbilityPresets.powerBoostWithTypeWhenLowHP(AbilityDex.torrent, Type.WATER, 100 / 3);
    AbilityDex.volt_absorb = new Ability({
        name: "volt_absorb",
        displayName: "Volt Absorb"
    });
    AbilityPresets.immunityToTypeWithHealing(AbilityDex.volt_absorb, Type.ELECTRIC, 25);
    AbilityDex.water_absorb = new Ability({
        name: "water_absorb",
        displayName: "Water Absorb"
    });
    AbilityPresets.immunityToTypeWithHealing(AbilityDex.water_absorb, Type.WATER, 25);
})(AbilityDex || (AbilityDex = {}));
export default AbilityDex;
