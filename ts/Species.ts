import Ability from "./Ability.js";
import Stats from "./Stats.js";
import Type from "./Type.js";

type SpeciesData = Pick<Species, "name" | "displayName" | "types" | "baseStats" | "abilities">;

type SpeciesAbiltiesData = { primary: Ability, secondary?: Ability, hidden?: Ability };

class Species {
	readonly name: string;
	readonly displayName: string;
	readonly types: [Type] | [Type, Type];
	readonly baseStats: Stats.BaseStats;
	readonly abilities: SpeciesAbiltiesData;
	// add available abilities property to the species class

	constructor(data: SpeciesData) {
		this.name = data.name;
		this.displayName = data.displayName;
		this.types = data.types;
		this.baseStats = data.baseStats;
		this.abilities = data.abilities;
	}
}

export default Species;