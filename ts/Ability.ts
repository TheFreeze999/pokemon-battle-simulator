type AbilityData = Pick<Ability, "name" | "displayName">

class Ability {
	readonly name: string;
	readonly displayName: string;

	constructor(data: AbilityData) {
		this.name = data.name;
		this.displayName = data.displayName;
	}
}

export default Ability;