import Type from "./Type.js";
import { random as randomInteger } from "./util.js";

type MoveData =
	Pick<Move, "name" | "type" | "category" | "basePower"> &
	Partial<Pick<Move, "priority">>;

class Move {
	readonly name: string;
	readonly type: Type;
	readonly category: Move.Category;
	readonly basePower?: number;
	readonly priority: number;

	constructor(data: MoveData) {
		this.name = data.name;
		this.type = data.type;
		this.category = data.category;
		this.basePower = data.basePower;
		this.priority = data.priority ?? 0;
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