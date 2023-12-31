import Battler from "../../Battler.js";
import Move from "../../Move.js";
import Type from "../../Type.js";
import BattleAction from "../../queue/BattleAction.js";
import MoveAction from "../../queue/actions/MoveAction.js";
import Effect from "../Effect.js";

class FlashFireEffect extends Effect {
	constructor() {
		super('flash_fire');
	}

	preExecutionModifiers: BattleAction.Modifier[] = [
		{
			priority: 0,
			async modify(battleAction, owner) {
				if (!(battleAction instanceof MoveAction)) return;
				if (battleAction.user !== owner) return;
				if (battleAction.move.type !== Type.FIRE) return;
				if (battleAction.move.category === Move.Category.STATUS || !battleAction.move.dealDirectDamage) return;

				battleAction.attackStatMultiplier *= 1.5;
			}
		}
	]
}

export default FlashFireEffect;