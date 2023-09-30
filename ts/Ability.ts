import Battler from "./Battler.js";
import BattleAction from "./queue/BattleAction.js";

type AbilityData =
	Pick<Ability, "name" | "displayName"> &
	/* Optional Fields */
	Partial<Pick<Ability, "battleActionModifiers">>;

class Ability {
	readonly name: string;
	readonly displayName: string;
	readonly battleActionModifiers: Ability.BattleActionModifier[];

	constructor(data: AbilityData) {
		this.name = data.name;
		this.displayName = data.displayName;
		this.battleActionModifiers = data.battleActionModifiers ?? []
	}
}

namespace Ability {
	export interface BattleActionModifier {
		/** Highest first */
		priority: number;
		modify(battleAction: BattleAction, owner: Battler): void;
	}
}

export default Ability;