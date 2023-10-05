import Battle from "./Battle.js";
import Battler from "./Battler.js";
import BattleAction from "./queue/BattleAction.js";

type AbilityData =
	/* Required Fields */
	Pick<Ability, "name" | "displayName"> &
	/* Optional Fields */
	Partial<Pick<Ability, "battleActionModifiers" | "applyPostActionBattleActions">>;

class Ability {
	readonly name: string;
	readonly displayName: string;
	readonly battleActionModifiers: BattleAction.Modifier[];
	readonly applyPostActionBattleActions: (owner: Battler) => void;

	constructor(data: AbilityData) {
		this.name = data.name;
		this.displayName = data.displayName;
		this.battleActionModifiers = data.battleActionModifiers ?? [];
		this.applyPostActionBattleActions = data.applyPostActionBattleActions ?? (() => { });
	}
}

export default Ability;