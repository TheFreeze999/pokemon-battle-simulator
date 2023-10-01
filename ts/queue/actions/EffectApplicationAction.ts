import Battler from "../../Battler.js";
import Effect from "../../effects/Effect.js";
import BattleAction from "../BattleAction.js";

class EffectApplicationAction extends BattleAction {
	reasonText: string | null = null;
	constructor(public target: Battler, public effect: Effect) {
		super();
	}
	clause() {
		if (!this.effect.canBeAppliedOnFaintedBattler && this.target.fainted) return false;
		if (!this.effect.stackable && this.target.hasEffect(this.effect.type)) return false;
		return true;
	}
	async execute() {
		if (this.reasonText) console.log(this.reasonText)
		this.effect.eventHandler.dispatchEvent('application', this.target);
		this.target.addEffect(this.effect);
	}
}

export default EffectApplicationAction;