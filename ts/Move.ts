import Battler from "./Battler.js";
import Type from "./Type.js";
import MoveAction from "./queue/actions/MoveAction.js";
import { randomInteger as randomInteger } from "./util.js";

type MoveData =
	/* Required Fields */
	Pick<Move, "name" | "displayName" | "type" | "category" | "accuracy" | "pp"> &
	/* Optional Fields */
	Partial<Pick<Move, "priority" | "basePower" | "dealDirectDamage" | "applySecondaryEffects" | "contact" | "criticalHitRatio" | "ignoreTypeEffectiveness" | "targeting">>;

class Move {
	readonly name: string;
	readonly displayName: string;
	readonly type: Type;
	readonly category: Move.Category;
	readonly basePower?: number;
	readonly priority: number;
	readonly targeting: Move.Targeting;
	readonly accuracy: number;
	readonly dealDirectDamage: boolean;
	readonly contact: boolean;
	readonly criticalHitRatio: number;
	readonly pp: number;
	readonly ignoreTypeEffectiveness: boolean;
	readonly applySecondaryEffects: (moveAction: MoveAction) => void;

	constructor(data: MoveData) {
		this.name = data.name;
		this.displayName = data.displayName;
		this.type = data.type;
		this.category = data.category;
		this.basePower = data.basePower;
		this.priority = data.priority ?? 0;
		this.targeting = data.targeting ?? Move.Targeting.SINGLE_OTHER;
		this.accuracy = data.accuracy;
		this.dealDirectDamage = data.dealDirectDamage ?? true;
		this.contact = data.contact ?? false;
		this.criticalHitRatio = data.criticalHitRatio ?? 0;
		this.pp = data.pp;
		this.ignoreTypeEffectiveness = data.ignoreTypeEffectiveness ?? false;
		this.applySecondaryEffects = data.applySecondaryEffects ?? (() => { });
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
	export enum Targeting {
		SELF,
		SINGLE_OTHER,
		ALL_OTHERS,
		NONE
	}
}

export default Move;