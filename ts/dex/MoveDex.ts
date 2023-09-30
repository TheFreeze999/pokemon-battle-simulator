import Battler from "../Battler.js";
import Move from "../Move.js";
import Type, { TypeUtils } from "../Type.js";
import DamageAction from "../queue/actions/DamageAction.js";
import MoveAction from "../queue/actions/MoveAction.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";
import { randomInteger } from '../util.js';

namespace MoveDex {
	export const dragon_rage = new Move({
		name: "dragon_rage",
		displayName: "Dragon Rage",
		type: Type.DRAGON,
		category: Move.Category.SPECIAL,
		applySecondaryEffects(moveAction: MoveAction) {
			if (TypeUtils.calculateEffectiveness([Type.DRAGON], moveAction.target.types) === 0) {
				console.log(TypeUtils.getInfoFromEffectiveness(0));
				return;
			}

			const damageAction = new DamageAction(moveAction.target, 40);
			damageAction.priority = 5;
			damageAction.cause = moveAction;
			moveAction.target.battle?.queue.push(damageAction);
		}
	});
	export const energy_ball = new Move({
		name: "energy_ball",
		displayName: "Energy Ball",
		type: Type.GRASS,
		category: Move.Category.SPECIAL,
		basePower: 90,
		applySecondaryEffects(moveAction: MoveAction) {
			const statDropAction = new StatStageChangeAction(moveAction.target, "specialDefense", -1);
			statDropAction.chance = [10, 100];
			statDropAction.priority = 3;
			statDropAction.cause = moveAction;
			moveAction.target.battle?.queue.push(statDropAction);
		}
	});
	export const flamethrower = new Move({
		name: "flamethrower",
		displayName: "Flamethrower",
		type: Type.FIRE,
		category: Move.Category.SPECIAL,
		basePower: 90
	});
	export const metal_sound = new Move({
		name: "metal_sound",
		displayName: "Metal Sound",
		type: Type.STEEL,
		category: Move.Category.STATUS,
		applySecondaryEffects(moveAction: MoveAction) {
			const statDropAction = new StatStageChangeAction(moveAction.target, "specialDefense", -2);
			statDropAction.priority = 3;
			statDropAction.cause = moveAction;
			moveAction.target.battle?.queue.push(statDropAction);
		}
	});
	export const screech = new Move({
		name: "screech",
		displayName: "Screech",
		type: Type.NORMAL,
		category: Move.Category.STATUS,
		applySecondaryEffects(moveAction: MoveAction) {
			const statDropAction = new StatStageChangeAction(moveAction.target, "defense", -2);
			statDropAction.priority = 3;
			statDropAction.cause = moveAction;
			moveAction.target.battle?.queue.push(statDropAction);
		}
	});
	export const tackle = new Move({
		name: "tackle",
		displayName: "Tackle",
		type: Type.NORMAL,
		category: Move.Category.PHYSICAL,
		basePower: 55
	});
}

export default MoveDex;