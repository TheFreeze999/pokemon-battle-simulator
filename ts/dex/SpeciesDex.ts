import Species from "../Species.js";
import Type from "../Type.js";
import AbilityDex from "./AbilityDex.js";

namespace SpeciesDex {
	export const bulbasaur = new Species({
		name: "bulbasaur",
		displayName: "Bulbasaur",
		types: [Type.GRASS, Type.POISON],
		baseStats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 49 },
		abilities: { primary: AbilityDex.overgrow },
	});
	export const charmander = new Species({
		name: "charmander",
		displayName: "Charmander",
		types: [Type.FIRE],
		baseStats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 },
		abilities: { primary: AbilityDex.blaze },
	});
	export const fletchling = new Species({
		name: "fletchling",
		displayName: "Fletchling",
		types: [Type.NORMAL, Type.FLYING],
		baseStats: { hp: 45, attack: 50, defense: 43, specialAttack: 40, specialDefense: 38, speed: 62 },
		abilities: { primary: AbilityDex.big_pecks },
	});
}

export default SpeciesDex;