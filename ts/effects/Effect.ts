import Battle from "../Battle.js";
import Battler from "../Battler.js";
import Events from "../Events.js";
import BattleAction from "../queue/BattleAction.js";

abstract class Effect {
	host: Battler | null = null;
	eventHandler = new Events.Handler();
	preExecutionModifiers: BattleAction.Modifier[] = [];
	postExecutionModifiers: BattleAction.Modifier[] = [];
	canBeAppliedOnFaintedBattler = false;
	stackable = false;

	constructor(public type: string) { }

	applyFinalPhaseBattleActions(owner: Battler) { }
}

export default Effect;