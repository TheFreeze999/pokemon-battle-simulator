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
}

export default MoveDex;