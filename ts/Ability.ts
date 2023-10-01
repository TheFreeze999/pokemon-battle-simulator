import Battler from "./Battler.js";
import BattleAction from "./queue/BattleAction.js";

type AbilityData =
	Pick<Ability, "name" | "displayName"> &
	/* Optional Fields */
	Partial<Pick<Ability, "battleActionModifiers">>;

class Ability {
	readonly name: string;
	readonly displayName: string;
	readonly battleActionModifiers: BattleAction.Modifier[];

	constructor(data: AbilityData) {
		this.name = data.name;
		this.displayName = data.displayName;
		this.battleActionModifiers = data.battleActionModifiers ?? []
	}
}

export default Ability;