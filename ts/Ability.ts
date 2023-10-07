import Battle from "./Battle.js";
import Battler from "./Battler.js";
import BattleAction from "./queue/BattleAction.js";

type AbilityData =
	/* Required Fields */
	Pick<Ability, "name" | "displayName"> &
	/* Optional Fields */
	Partial<Pick<Ability, "preExecutionModifiers" | "postExecutionModifiers" | "applyFinalPhaseBattleActions">>;

class Ability {
	readonly name: string;
	readonly displayName: string;
	readonly preExecutionModifiers: BattleAction.Modifier[];
	readonly postExecutionModifiers: BattleAction.Modifier[];
	readonly applyFinalPhaseBattleActions: (owner: Battler) => void;

	constructor(data: AbilityData) {
		this.name = data.name;
		this.displayName = data.displayName;
		this.preExecutionModifiers = data.preExecutionModifiers ?? [];
		this.postExecutionModifiers = data.postExecutionModifiers ?? [];
		this.applyFinalPhaseBattleActions = data.applyFinalPhaseBattleActions ?? (() => { });
	}
}

export default Ability;