import Battler from "../../../Battler.js";
import Move from "../../../Move.js";
import BattleAction from "../../../queue/BattleAction.js";
import DamageAction from "../../../queue/actions/DamageAction.js";
import MoveAction from "../../../queue/actions/MoveAction.js";
import { delay } from "../../../util.js";
import Effect from "../../Effect.js";

class BurnEffect extends Effect {
	constructor() {
		super('burn');

		this.eventHandler.addEventListener('application', async (battler: Battler) => {
			console.log(`${battler.displayName} was burned.`);
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

	applyPostActionBattleActions(owner: Battler): void {
		const damageAmount = owner.initialStats.hp / 16;
		const damageAction = new DamageAction(owner, damageAmount);
		damageAction.eventHandler.addEventListener('before execution', async () => {
			owner.battle?.queue.pause();
			console.log(`${owner.displayName} was hurt by its burn.`);
			await delay(1000);
			owner.battle?.queue.resume();
		})
		owner.battle?.queue.push(damageAction);
	}
}

export default BurnEffect;