import Ability from "../Ability.js";
import Type from "../Type.js";
import MoveAction from "../queue/actions/MoveAction.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";
var AbilityDex;
(function (AbilityDex) {
    AbilityDex.no_ability = new Ability({
        name: "no_ability",
        displayName: "No Ability"
    });
    AbilityDex.overgrow = new Ability({
        name: "overgrow",
        displayName: "Overgrow",
        battleActionModifiers: [
            {
                priority: 0,
                modify(battleAction, owner) {
                    if (!(battleAction instanceof MoveAction))
                        return;
                    if (battleAction.user !== owner)
                        return;
                    if (owner.hpPercentage > (100 / 3))
                        return;
                    if (battleAction.move.type !== Type.GRASS)
                        return;
                    battleAction.attackStatMultiplier *= 1.5;
                }
            }
        ]
    });
    AbilityDex.blaze = new Ability({
        name: "blaze",
        displayName: "Blaze",
        battleActionModifiers: [
            {
                priority: 0,
                modify(battleAction, owner) {
                    if (!(battleAction instanceof MoveAction))
                        return;
                    if (battleAction.user !== owner)
                        return;
                    if (owner.hpPercentage > (100 / 3))
                        return;
                    if (battleAction.move.type !== Type.FIRE)
                        return;
                    battleAction.attackStatMultiplier *= 1.5;
                }
            }
        ]
    });
    AbilityDex.torrent = new Ability({
        name: "torrent",
        displayName: "Torrent",
        battleActionModifiers: [
            {
                priority: 0,
                modify(battleAction, owner) {
                    if (!(battleAction instanceof MoveAction))
                        return;
                    if (battleAction.user !== owner)
                        return;
                    if (owner.hpPercentage > (100 / 3))
                        return;
                    if (battleAction.move.type !== Type.WATER)
                        return;
                    battleAction.attackStatMultiplier *= 1.5;
                }
            }
        ]
    });
    AbilityDex.sap_sipper = new Ability({
        name: "sap_sipper",
        displayName: "Sap Sipper",
        battleActionModifiers: [
            {
                priority: 0,
                modify(battleAction, owner) {
                    if (!(battleAction instanceof MoveAction))
                        return;
                    if (battleAction.target !== owner)
                        return;
                    if (battleAction.move.type !== Type.GRASS)
                        return;
                    battleAction.negateDirectDamage = true;
                    battleAction.performSecondaryEffects = false;
                    battleAction.showTypeEffectivenessInfoText = false;
                    const statBoostAction = new StatStageChangeAction(owner, "attack", 1);
                    statBoostAction.reasonText = `[${owner.displayName}'s Sap Sipper]`;
                    statBoostAction.priority = 15;
                    statBoostAction.cause = battleAction;
                    battleAction.queue?.push(statBoostAction);
                }
            }
        ]
    });
    AbilityDex.big_pecks = new Ability({
        name: "big_pecks",
        displayName: "Big Pecks",
        battleActionModifiers: [
            {
                priority: 0,
                modify(battleAction, owner) {
                    if (!(battleAction instanceof StatStageChangeAction))
                        return;
                    if (battleAction.target !== owner)
                        return;
                    if (battleAction.stat !== "defense" || battleAction.amount > 0)
                        return;
                    battleAction.toExecute = false;
                }
            }
        ]
    });
})(AbilityDex || (AbilityDex = {}));
export default AbilityDex;
