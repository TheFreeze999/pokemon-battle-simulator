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
		abilities: { primary: AbilityDex.no_ability },
	});
	export const squirtle = new Species({
		name: "squirtle",
		displayName: "Squirtle",
		types: [Type.WATER],
		baseStats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
		abilities: { primary: AbilityDex.no_ability },
	});
	export const jolteon = new Species({
		name: "jolteon",
		displayName: "Jolteon",
		types: [Type.ELECTRIC],
		baseStats: { hp: 65, attack: 65, defense: 60, specialAttack: 110, specialDefense: 95, speed: 130 },
		abilities: { primary: AbilityDex.volt_absorb },
	});
	export const litwick = new Species({
		name: "litwick",
		displayName: "Litwick",
		types: [Type.GHOST, Type.FIRE],
		baseStats: { hp: 50, attack: 30, defense: 55, specialAttack: 65, specialDefense: 55, speed: 20 },
		abilities: { primary: AbilityDex.no_ability, secondary: AbilityDex.no_ability },
	});
	export const fletchling = new Species({
		name: "fletchling",
		displayName: "Fletchling",
		types: [Type.NORMAL, Type.FLYING],
		baseStats: { hp: 45, attack: 50, defense: 43, specialAttack: 40, specialDefense: 38, speed: 62 },
		abilities: { primary: AbilityDex.no_ability },
	});
	export const honedge = new Species({
		name: "honedge",
		displayName: "Honedge",
		types: [Type.STEEL, Type.GHOST],
		baseStats: { hp: 45, attack: 80, defense: 100, specialAttack: 35, specialDefense: 37, speed: 28 },
		abilities: { primary: AbilityDex.no_ability },
	});

}

export default SpeciesDex;