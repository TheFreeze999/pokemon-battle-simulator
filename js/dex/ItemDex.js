import Item from "../Item.js";
import HealAction from "../queue/actions/HealAction.js";
var ItemDex;
(function (ItemDex) {
    ItemDex.leftovers = new Item({
        name: "leftovers",
        displayName: "Leftovers",
        applyFinalPhaseBattleActions(owner) {
            if (!owner.switchedIn)
                return;
            const healAmount = owner.initialStats.hp / 16;
            const healAction = new HealAction(owner, healAmount);
            healAction.priority = 5 + owner.actingPriority;
            healAction.eventHandler.addEventListener('before execution', async () => {
                await owner.battle?.renderer.showTextWhilePausingQueue(`${owner.displayName} was healed by its Leftovers.`);
            });
            owner.battle?.queue.push(healAction);
        }
    });
})(ItemDex || (ItemDex = {}));
export default ItemDex;
