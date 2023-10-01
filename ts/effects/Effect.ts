import Battler from "../Battler.js";
import BattleAction from "../queue/BattleAction.js";

abstract class Effect {
	host: Battler | null = null;
	abstract battleActionModifiers: BattleAction.Modifier[];

	constructor(public type: string) { }
}

export default Effect;