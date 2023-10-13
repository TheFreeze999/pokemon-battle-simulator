import Ability from "../Ability.js";
import Item from "../Item.js";
import DamageAction from "../queue/actions/DamageAction.js";
import HealAction from "../queue/actions/HealAction.js";
import Type from '../Type.js';

namespace ItemDex {
	export const leftovers = new Item({
		name: "leftovers",
		displayName: "Leftovers",
		applyFinalPhaseBattleActions(owner) {
			if (!owner.switchedIn) return;
			const healAmount = owner.initialStats.hp / 16;
			const healAction = new HealAction(owner, healAmount);
			healAction.priority = 5 + owner.actingPriority;
			healAction.textControls.showHpGainedText = false;
			healAction.eventHandler.addEventListener('before execution', async () => {
				await owner.battle?.renderer.showTextWhilePausingQueue(`${owner.displayName} was healed by its Leftovers.`);
			});
			owner.battle?.queue.push(healAction);
		}
	});
}

export default ItemDex;