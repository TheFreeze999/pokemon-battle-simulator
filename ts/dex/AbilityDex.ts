import Ability from "../Ability.js";

namespace AbilityDex {
	export const noAbility = new Ability({
		name: "no_ability",
		displayName: "No Ability"
	});
	export const overgrow = new Ability({
		name: "overgrow",
		displayName: "Overgrow"
	});
	export const blaze = new Ability({
		name: "blaze",
		displayName: "Blaze"
	});
}

export default AbilityDex;