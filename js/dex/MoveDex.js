import Move from "../Move.js";
import Type from "../Type.js";
var MoveDex;
(function (MoveDex) {
    MoveDex.tackle = new Move({
        name: "tackle",
        displayName: "Tackle",
        type: Type.NORMAL,
        category: Move.Category.PHYSICAL,
        basePower: 55
    });
    MoveDex.flamethrower = new Move({
        name: "flamethrower",
        displayName: "Flamethrower",
        type: Type.FIRE,
        category: Move.Category.SPECIAL,
        basePower: 90
    });
    MoveDex.energy_ball = new Move({
        name: "energy_ball",
        displayName: "Energy Ball",
        type: Type.GRASS,
        category: Move.Category.SPECIAL,
        basePower: 90
    });
})(MoveDex || (MoveDex = {}));
export default MoveDex;
