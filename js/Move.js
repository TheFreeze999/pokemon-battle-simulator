import { randomInteger as randomInteger } from "./util.js";
class Move {
    name;
    displayName;
    type;
    category;
    basePower;
    priority;
    targeting;
    accuracy;
    dealDirectDamage;
    contact;
    criticalHitRatio;
    pp;
    ignoreTypeEffectiveness;
    applySecondaryEffects;
    constructor(data) {
        this.name = data.name;
        this.displayName = data.displayName;
        this.type = data.type;
        this.category = data.category;
        this.basePower = data.basePower;
        this.priority = data.priority ?? 0;
        this.targeting = data.targeting ?? Move.Targeting.SINGLE_OTHER;
        this.accuracy = data.accuracy;
        this.dealDirectDamage = data.dealDirectDamage ?? true;
        this.contact = data.contact ?? false;
        this.criticalHitRatio = data.criticalHitRatio ?? 0;
        this.pp = data.pp;
        this.ignoreTypeEffectiveness = data.ignoreTypeEffectiveness ?? false;
        this.applySecondaryEffects = data.applySecondaryEffects ?? (() => { });
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
    let Targeting;
    (function (Targeting) {
        Targeting[Targeting["SELF"] = 0] = "SELF";
        Targeting[Targeting["SINGLE_OTHER"] = 1] = "SINGLE_OTHER";
        Targeting[Targeting["ALL_OTHERS"] = 2] = "ALL_OTHERS";
        Targeting[Targeting["NONE"] = 3] = "NONE";
    })(Targeting = Move.Targeting || (Move.Targeting = {}));
})(Move || (Move = {}));
export default Move;
