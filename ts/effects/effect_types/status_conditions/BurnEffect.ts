import Battler from "../../../Battler.js";
import Move from "../../../Move.js";
import Type from "../../../Type.js";
import BattleAction from "../../../queue/BattleAction.js";
import DamageAction from "../../../queue/actions/DamageAction.js";
import MoveAction from "../../../queue/actions/MoveAction.js";
import Effect from "../../Effect.js";

class BurnEffect extends Effect {
	constructor() {
		super('burn');

		this.eventHandler.addEventListener('application', async (battler: Battler) => {
			await battler.battle?.renderer.showTextWhilePausingQueue(`${battler.displayName} was burned.`);
		})
	}

	preExecutionModifiers: BattleAction.Modifier[] = [
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

	applyFinalPhaseBattleActions(owner: Battler): void {
		if (!owner.switchedIn) return;
		const damageAmount = owner.initialStats.hp / 16;
		const damageAction = new DamageAction(owner, damageAmount);
		damageAction.priority = 4;
		damageAction.eventHandler.addEventListener('before execution', async () => {
			await owner.battle?.renderer.showTextWhilePausingQueue(`${owner.displayName} was hurt by its burn.`);
		})
		owner.battle?.queue.push(damageAction);
	}

	isImmune(battler: Battler): boolean {
		return battler.types.includes(Type.FIRE);
	}
}

export default BurnEffect;