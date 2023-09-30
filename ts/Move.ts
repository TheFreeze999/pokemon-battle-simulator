import Battler from "./Battler.js";
import Type from "./Type.js";
import { randomInteger as randomInteger } from "./util.js";

type MoveData =
	/* Required Fields */
	Pick<Move, "name" | "displayName" | "type" | "category"> &
	/* Optional Fields */
	Partial<Pick<Move, "priority" | "basePower" | "applySecondaryEffects">>;

class Move {
	readonly name: string;
	readonly displayName: string;
	readonly type: Type;
	readonly category: Move.Category;
	readonly basePower?: number;
	readonly priority: number;
	readonly applySecondaryEffects: (user: Battler, target: Battler) => void;

	constructor(data: MoveData) {
		this.name = data.name;
		this.displayName = data.displayName;
		this.type = data.type;
		this.category = data.category;
		this.basePower = data.basePower;
		this.priority = data.priority ?? 0;
		this.applySecondaryEffects = data.applySecondaryEffects || (() => { })
	}

	static standardDamageCalculation(attackerLevel: number, attackingStat: number, defendingStat: number, power: number, multiplier: number): number {
		const randomMultiplier = randomInteger(85, 100) / 100;

		return Math.round(((2 * attackerLevel / 5 + 2) * power * attackingStat / defendingStat / 50 + 2) * randomMultiplier * multiplier);
	}
}

namespace Move {
	export enum Category {
		PHYSICAL,
		SPECIAL,
		STATUS
	}
}

export default Move;