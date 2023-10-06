var Type;
(function (Type) {
    Type[Type["NORMAL"] = 0] = "NORMAL";
    Type[Type["FIRE"] = 1] = "FIRE";
    Type[Type["WATER"] = 2] = "WATER";
    Type[Type["ELECTRIC"] = 3] = "ELECTRIC";
    Type[Type["GRASS"] = 4] = "GRASS";
    Type[Type["ICE"] = 5] = "ICE";
    Type[Type["FIGHTING"] = 6] = "FIGHTING";
    Type[Type["POISON"] = 7] = "POISON";
    Type[Type["GROUND"] = 8] = "GROUND";
    Type[Type["FLYING"] = 9] = "FLYING";
    Type[Type["PSYCHIC"] = 10] = "PSYCHIC";
    Type[Type["BUG"] = 11] = "BUG";
    Type[Type["ROCK"] = 12] = "ROCK";
    Type[Type["GHOST"] = 13] = "GHOST";
    Type[Type["DRAGON"] = 14] = "DRAGON";
    Type[Type["DARK"] = 15] = "DARK";
    Type[Type["STEEL"] = 16] = "STEEL";
    Type[Type["FAIRY"] = 17] = "FAIRY";
})(Type || (Type = {}));
export var TypeUtils;
(function (TypeUtils) {
    TypeUtils.allTypes = Object.values(Type).filter(value => typeof value !== 'string');
    TypeUtils.allTypesAsStrings = Object.values(Type).filter(value => typeof value === 'string');
    TypeUtils.CHART = {
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
    function calculateMonotypeEffectiveness(attacker, defender) {
        let result = 1;
        const defendingEffectivenessRules = TypeUtils.CHART[defender];
        if (defendingEffectivenessRules.weakTo.includes(attacker))
            result = 2;
        if (defendingEffectivenessRules.resists.includes(attacker))
            result = 0.5;
        if (defendingEffectivenessRules.immuneTo.includes(attacker))
            result = 0;
        return result;
    }
    function calculateMultiDefenderEffectiveness(attacker, defenders) {
        return defenders.reduce((prev, curr) => prev * calculateMonotypeEffectiveness(attacker, curr), 1);
    }
    function calculateEffectiveness(attackers, defenders) {
        return attackers.reduce((prev, curr) => prev * calculateMultiDefenderEffectiveness(curr, defenders), 1);
    }
    TypeUtils.calculateEffectiveness = calculateEffectiveness;
    function getDisplayName(type) {
        return Type[type].split("").map((char, i) => i === 0 ? char.toUpperCase() : char.toLowerCase()).join("");
    }
    TypeUtils.getDisplayName = getDisplayName;
    function getInfoFromEffectiveness(effectiveness) {
        if (effectiveness === 1)
            return null;
        else if (effectiveness === 0)
            return "It has no effect.";
        else if (effectiveness < 1)
            return "It's not very effective.";
        else if (effectiveness > 1)
            return "It's super effective!";
    }
    TypeUtils.getInfoFromEffectiveness = getInfoFromEffectiveness;
    function getNameFromEffectiveness(effectiveness) {
        if (effectiveness === 1)
            return "neutral";
        else if (effectiveness === 0)
            return "immune";
        else if (effectiveness < 1)
            return "resist";
        return "weak";
    }
    TypeUtils.getNameFromEffectiveness = getNameFromEffectiveness;
})(TypeUtils || (TypeUtils = {}));
export default Type;
