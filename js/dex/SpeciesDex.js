import Species from "../Species.js";
import Type from "../Type.js";
var SpeciesDex;
(function (SpeciesDex) {
    SpeciesDex.bulbasaur = new Species({
        name: "bulbasaur",
        types: [Type.GRASS, Type.POISON],
        baseStats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 49 },
    });
    SpeciesDex.charmander = new Species({
        name: "charmander",
        types: [Type.FIRE],
        baseStats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 }
    });
})(SpeciesDex || (SpeciesDex = {}));
export default SpeciesDex;
