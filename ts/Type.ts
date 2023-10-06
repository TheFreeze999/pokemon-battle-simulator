enum Type {
	NORMAL,
	FIRE,
	WATER,
	ELECTRIC,
	GRASS,
	ICE,
	FIGHTING,
	POISON,
	GROUND,
	FLYING,
	PSYCHIC,
	BUG,
	ROCK,
	GHOST,
	DRAGON,
	DARK,
	STEEL,
	FAIRY
}

interface DefendingEffectivenessRules {
	weakTo: Type[];
	resists: Type[];
	immuneTo: Type[];
}

export namespace TypeUtils {
	export type TypeString = keyof typeof Type;
	export const allTypes = Object.values(Type).filter(value => typeof value !== 'string') as Type[];
	export const allTypesAsStrings = Object.values(Type).filter(value => typeof value === 'string') as TypeString[];

	export const CHART: Record<Type, DefendingEffectivenessRules> = {
		[Type.NORMAL]: {
			weakTo: [Type.FIGHTING],
			resists: [],
			immuneTo: [Type.GHOST]
		},
		[Type.FIRE]: {
			weakTo: [Type.WATER, Type.GROUND, Type.ROCK],
			resists: [Type.FIRE, Type.GRASS, Type.ICE, Type.BUG, Type.STEEL, Type.FAIRY],
			immuneTo: []
		},
		[Type.WATER]: {
			weakTo: [Type.ELECTRIC, Type.GRASS],
			resists: [Type.FIRE, Type.WATER, Type.ICE, Type.STEEL],
			immuneTo: []
		},
		[Type.ELECTRIC]: {
			weakTo: [Type.GROUND],
			resists: [Type.ELECTRIC, Type.FLYING, Type.STEEL],
			immuneTo: []
		},
		[Type.GRASS]: {
			weakTo: [Type.FIRE, Type.ICE, Type.POISON, Type.FLYING, Type.BUG],
			resists: [Type.WATER, Type.ELECTRIC, Type.GRASS, Type.GROUND],
			immuneTo: []
		},
		[Type.ICE]: {
			weakTo: [Type.FIRE, Type.FIGHTING, Type.ROCK, Type.STEEL],
			resists: [Type.ICE],
			immuneTo: []
		},
		[Type.FIGHTING]: {
			weakTo: [Type.FLYING, Type.PSYCHIC, Type.FAIRY],
			resists: [Type.BUG, Type.ROCK, Type.DARK],
			immuneTo: []
		},
		[Type.POISON]: {
			weakTo: [Type.GROUND, Type.PSYCHIC],
			resists: [Type.GRASS, Type.FIGHTING, Type.POISON, Type.BUG, Type.FAIRY],
			immuneTo: []
		},
		[Type.GROUND]: {
			weakTo: [Type.WATER, Type.GRASS, Type.ICE],
			resists: [Type.POISON, Type.ROCK],
			immuneTo: [Type.ELECTRIC]
		},
		[Type.FLYING]: {
			weakTo: [Type.ELECTRIC, Type.ICE, Type.ROCK],
			resists: [Type.GRASS, Type.FIGHTING, Type.BUG],
			immuneTo: [Type.GROUND]
		},
		[Type.PSYCHIC]: {
			weakTo: [Type.BUG, Type.GHOST, Type.DARK],
			resists: [Type.FIGHTING, Type.PSYCHIC],
			immuneTo: []
		},
		[Type.BUG]: {
			weakTo: [Type.FIRE, Type.FLYING, Type.ROCK],
			resists: [Type.GRASS, Type.FIGHTING, Type.GROUND],
			immuneTo: []
		},
		[Type.ROCK]: {
			weakTo: [Type.WATER, Type.GRASS, Type.FIGHTING, Type.GROUND],
			resists: [Type.NORMAL, Type.FIRE, Type.POISON, Type.FLYING],
			immuneTo: []
		},
		[Type.GHOST]: {
			weakTo: [Type.GHOST, Type.DARK],
			resists: [Type.POISON, Type.BUG],
			immuneTo: [Type.NORMAL, Type.FIGHTING]
		},
		[Type.DRAGON]: {
			weakTo: [Type.ICE, Type.DRAGON, Type.FAIRY],
			resists: [Type.FIRE, Type.WATER, Type.ELECTRIC, Type.GRASS],
			immuneTo: []
		},
		[Type.DARK]: {
			weakTo: [Type.FIGHTING, Type.BUG, Type.FAIRY],
			resists: [Type.GHOST, Type.DARK],
			immuneTo: [Type.PSYCHIC]
		},
		[Type.STEEL]: {
			weakTo: [Type.FIRE, Type.FIGHTING, Type.GROUND],
			resists: [Type.NORMAL, Type.GRASS, Type.ICE, Type.FLYING, Type.PSYCHIC, Type.BUG, Type.ROCK, Type.DRAGON, Type.STEEL, Type.FAIRY],
			immuneTo: [Type.POISON]
		},
		[Type.FAIRY]: {
			weakTo: [Type.POISON, Type.STEEL],
			resists: [Type.FIGHTING, Type.BUG, Type.DARK],
			immuneTo: [Type.DRAGON]
		},
	};

	/**
	 * Calculates how one type fares defensively against another type.
	 * @returns 2 if weak, 1 if neutral, 0.5 is resisted, 0 if immune
	 */
	function calculateMonotypeEffectiveness(attacker: Type, defender: Type) {
		let result = 1;
		const defendingEffectivenessRules = CHART[defender];

		if (defendingEffectivenessRules.weakTo.includes(attacker)) result = 2;
		if (defendingEffectivenessRules.resists.includes(attacker)) result = 0.5;
		if (defendingEffectivenessRules.immuneTo.includes(attacker)) result = 0;

		return result;
	}

	function calculateMultiDefenderEffectiveness(attacker: Type, defenders: Type[]) {
		return defenders.reduce((prev, curr) => prev * calculateMonotypeEffectiveness(attacker, curr), 1);
	}

	export function calculateEffectiveness(attackers: Type[], defenders: Type[]) {
		return attackers.reduce((prev, curr) => prev * calculateMultiDefenderEffectiveness(curr, defenders), 1);
	}

	export function getDisplayName(type: Type): string {
		return Type[type].split("").map((char, i) => i === 0 ? char.toUpperCase() : char.toLowerCase()).join("");
	}

	export function getInfoFromEffectiveness(effectiveness: number) {
		if (effectiveness === 1) return null;
		else if (effectiveness === 0) return "It has no effect.";
		else if (effectiveness < 1) return "It's not very effective.";
		else if (effectiveness > 1) return "It's super effective!";
	}

	export function getNameFromEffectiveness(effectiveness: number) {
		if (effectiveness === 1) return "neutral";
		else if (effectiveness === 0) return "immune";
		else if (effectiveness < 1) return "resist";
		return "weak";
	}
}


export default Type;