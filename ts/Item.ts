import Battle from "./Battle.js";
import Battler from "./Battler.js";
import BattleAction from "./queue/BattleAction.js";

type ItemData =
	/* Required Fields */
	Pick<Item, "name" | "displayName"> &
	/* Optional Fields */
	Partial<Pick<Item, "preExecutionModifiers" | "postExecutionModifiers" | "applyPreStartPhaseBattleActions" | "applyFinalPhaseBattleActions">>;

class Item {
	readonly name: string;
	readonly displayName: string;
	readonly preExecutionModifiers: BattleAction.Modifier[];
	readonly postExecutionModifiers: BattleAction.Modifier[];
	readonly applyPreStartPhaseBattleActions: (owner: Battler) => void;
	readonly applyFinalPhaseBattleActions: (owner: Battler) => void;

	constructor(data: ItemData) {
		this.name = data.name;
		this.displayName = data.displayName;
		this.preExecutionModifiers = data.preExecutionModifiers ?? [];
		this.postExecutionModifiers = data.postExecutionModifiers ?? [];
		this.applyPreStartPhaseBattleActions = data.applyPreStartPhaseBattleActions ?? (() => { });
		this.applyFinalPhaseBattleActions = data.applyFinalPhaseBattleActions ?? (() => { });
	}
}

export default Item;