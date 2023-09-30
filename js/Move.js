import { random as randomInteger } from "./util.js";
class Move {
    name;
    displayName;
    type;
    category;
    basePower;
    priority;
    constructor(data) {
        this.name = data.name;
        this.displayName = data.displayName;
        this.type = data.type;
        this.category = data.category;
        this.basePower = data.basePower;
        this.priority = data.priority ?? 0;
    }
    static standardDamageCalculation(attackerLevel, attackingStat, defendingStat, power, multiplier) {
        const randomMultiplier = randomInteger(85, 100) / 100;
        return Math.round(((2 * attackerLevel / 5 + 2) * power * attackingStat / defendingStat / 50 + 2) * randomMultiplier * multiplier);
    }
}
(function (Move) {
    let Category;
    (function (Category) {
        Category[Category["PHYSICAL"] = 0] = "PHYSICAL";
        Category[Category["SPECIAL"] = 1] = "SPECIAL";
        Category[Category["STATUS"] = 2] = "STATUS";
    })(Category = Move.Category || (Move.Category = {}));
})(Move || (Move = {}));
export default Move;
