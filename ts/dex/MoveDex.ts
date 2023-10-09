import Move from "../Move.js";
import Type, { TypeUtils } from "../Type.js";
import BurnEffect from "../effects/effect_types/status_conditions/BurnEffect.js";
import DamageAction from "../queue/actions/DamageAction.js";
import EffectApplicationAction from "../queue/actions/EffectApplicationAction.js";
import MoveAction from "../queue/actions/MoveAction.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";
import RemoveItemAction from '../queue/actions/RemoveItemAction.js';
import GiveItemAction from "../queue/actions/GiveItemAction.js";
import HealAction from "../queue/actions/HealAction.js";

namespace MoveDex {
	export const accelerock = new Move({
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
	export const struggle = new Move({
		name: "struggle",
		displayName: "Struggle",
		type: Type.NORMAL,
		category: Move.Category.PHYSICAL,
		basePower: 50,
		accuracy: -1,
		contact: true,
		priority: 1,
		pp: -1,
		ignoreTypeEffectiveness: true,
		applySecondaryEffects(moveAction) {
			const recoilAmount = Math.round(moveAction.user.initialStats.hp / 4);
			const recoilAction = new DamageAction(moveAction.user, recoilAmount);
			recoilAction.cause = moveAction;
			recoilAction.priority = 40;
			recoilAction.showText = false;
			recoilAction.showHpRemainingText = false;
			recoilAction.eventHandler.addEventListener('before execution', async () => {
				await moveAction.queue?.battle.renderer.showTextWhilePausingQueue(`${moveAction.user.displayName} lost some HP due to recoil.`)
			})
			moveAction.queue?.push(recoilAction);
		},
	});
}

export default MoveDex;