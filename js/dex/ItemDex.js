import Ability from "../Ability.js";
import DamageAction from "../queue/actions/DamageAction.js";
import HealAction from "../queue/actions/HealAction.js";
import Type from '../Type.js';
var AbilityDex;
(function (AbilityDex) {
    AbilityDex.leftovers = new Ability({
        name: "leftovers",
        displayName: "Leftovers",
        applyFinalPhaseBattleActions(owner) {
            if (!owner.switchedIn)
                return;
            const healAmount = owner.initialStats.hp / 16;
            const healAction = new HealAction(owner, healAmount);
            healAction.priority = 5;
            healAction.eventHandler.addEventListener('before execution', async () => {
                await owner.battle?.renderer.showTextWhilePausingQueue(`${owner.displayName} was healed by its Leftovers.`);
            });
            owner.battle?.queue.push(healAction);
        }
    });
    AbilityDex.black_sludge = new Ability({
        name: "black_sludge",
        displayName: "Black Sludge",
        applyFinalPhaseBattleActions(owner) {
            if (!owner.switchedIn)
                return;
            if (owner.types.includes(Type.POISON)) {
                const healAmount = owner.initialStats.hp / 16;
                const healAction = new HealAction(owner, healAmount);
                healAction.priority = 5;
                healAction.eventHandler.addEventListener('before execution', async () => {
                    await owner.battle?.renderer.showTextWhilePausingQueue(`${owner.displayName} was healed by its Black Sludge.`);
                });
                owner.battle?.queue.push(healAction);
            }
            else {
                const damageAmount = owner.initialStats.hp / 8;
                const damageAction = new DamageAction(owner, damageAmount);
                damageAction.priority = 4;
                damageAction.eventHandler.addEventListener('before execution', async () => {
                    await owner.battle?.renderer.showTextWhilePausingQueue(`${owner.displayName} was hurt by its Black Sludge.`);
                });
                owner.battle?.queue.push(damageAction);
            }
        }
    });
})(AbilityDex || (AbilityDex = {}));
export default AbilityDex;
