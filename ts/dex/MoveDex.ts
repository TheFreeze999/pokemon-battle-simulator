import Battler from "../Battler.js";
import Move from "../Move.js";
import Type from "../Type.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";
import { randomInteger } from '../util.js';

namespace MoveDex {
	export const tackle = new Move({
		name: "tackle",
		displayName: "Tackle",
		type: Type.NORMAL,
		category: Move.Category.PHYSICAL,
		basePower: 55
	});
	export const flamethrower = new Move({
		name: "flamethrower",
		displayName: "Flamethrower",
		type: Type.FIRE,
		category: Move.Category.SPECIAL,
		basePower: 90
	});
	export const energy_ball = new Move({
		name: "energy_ball",
		displayName: "Energy Ball",
		type: Type.GRASS,
		category: Move.Category.SPECIAL,
		basePower: 90,
		applySecondaryEffects(user: Battler, target: Battler) {
			const statDropAction = new StatStageChangeAction(target, "specialDefense", -12);
			statDropAction.chance = [50, 100];
			statDropAction.priority = 3;
			target.battle?.queue.push(statDropAction);
		}
	});
}

export default MoveDex;