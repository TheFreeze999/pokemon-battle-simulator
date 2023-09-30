import Stats from "./Stats.js";
import Type from "./Type.js";

type SpeciesData = Pick<Species, "name" | "displayName" | "types" | "baseStats">

class Species {
	readonly name: string;
	readonly displayName: string;
	readonly types: [Type] | [Type, Type];
	readonly baseStats: Stats.BaseStats;

	constructor(data: SpeciesData) {
		this.name = data.name;
		this.displayName = data.displayName;
		this.types = data.types;
		this.baseStats = data.baseStats;
	}
}

export default Species;