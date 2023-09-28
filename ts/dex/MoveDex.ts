import Move from "../Move.js";
import Type from "../Type.js";

namespace MoveDex {
	export const tackle = new Move({
		name: "tackle",
		type: Type.NORMAL,
		category: Move.Category.PHYSICAL,
		basePower: 55
	});
	export const flamethrower = new Move({
		name: "flamethrower",
		type: Type.FIRE,
		category: Move.Category.SPECIAL,
		basePower: 90
	});
	export const energy_ball = new Move({
		name: "energy_ball",
		type: Type.GRASS,
		category: Move.Category.SPECIAL,
		basePower: 90
	});
}

export default MoveDex;