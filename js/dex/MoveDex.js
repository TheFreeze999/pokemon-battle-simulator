import Move from "../Move.js";
import Type from "../Type.js";
var MoveDex;
(function (MoveDex) {
    MoveDex.accelerock = new Move({
        name: "accelerock",
        displayName: "Accelerock",
        type: Type.ROCK,
        category: Move.Category.PHYSICAL,
        basePower: 40,
        accuracy: 100,
        contact: true,
        priority: 1,
        pp: 20,
    });
})(MoveDex || (MoveDex = {}));
export default MoveDex;
