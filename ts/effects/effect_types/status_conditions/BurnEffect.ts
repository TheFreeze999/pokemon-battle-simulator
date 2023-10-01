import Battler from "../../../Battler.js";
import Move from "../../../Move.js";
import BattleAction from "../../../queue/BattleAction.js";
import MoveAction from "../../../queue/actions/MoveAction.js";
import Effect from "../../Effect.js";

class BurnEffect extends Effect {
	constructor() {
		super('burn');

		this.eventHandler.addEventListener('application', (battler: Battler) => {
			console.log(`${battler.displayName} was burned.`)
		})
	}

	battleActionModifiers: BattleAction.Modifier[] = [
		{
			priority: 0,
			modify(battleAction, owner) {
				if (!(battleAction instanceof MoveAction)) return;
				if (battleAction.user !== owner) return;
				if (battleAction.move.category !== Move.Category.PHYSICAL) return;

				battleAction.attackStatMultiplier *= 0.5;
			}
		}
	];
}

export default BurnEffect;