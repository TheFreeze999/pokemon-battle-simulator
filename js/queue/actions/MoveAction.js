import Move from "../../Move.js";
import { TypeUtils } from "../../Type.js";
import { delay } from "../../util.js";
import BattleAction from "../BattleAction.js";
import DamageAction from "./DamageAction.js";
class MoveAction extends BattleAction {
    user;
    target;
    move;
    constructor(user, target, move) {
        super();
        this.user = user;
        this.target = target;
        this.move = move;
    }
    async execute() {
        console.log(`${this.user.displayName} used ${this.move.displayName} on ${this.target.displayName}!`);
        await delay(2000);
        if (this.move.category !== Move.Category.STATUS && this.move.basePower !== undefined) {
            const userBoostedStats = this.user.calcBoostedStats();
            const targetBoostedStats = this.target.calcBoostedStats();
            const attackingStat = this.move.category === Move.Category.PHYSICAL ? userBoostedStats.attack : userBoostedStats.specialAttack;
            const defendingStat = this.move.category === Move.Category.PHYSICAL ? targetBoostedStats.defense : targetBoostedStats.specialDefense;
            // include type effectiveness and STAB
            const typeEffectiveness = TypeUtils.calculateEffectiveness([this.move.type], this.target.types);
            const stab = this.user.types.includes(this.move.type) ? 1.5 : 1;
            const multiplier = typeEffectiveness * stab;
            const typeEffectivenessInfoText = TypeUtils.getInfoFromEffectiveness(typeEffectiveness);
            if (typeEffectivenessInfoText)
                console.log(typeEffectivenessInfoText);
            const damageAmount = Move.standardDamageCalculation(this.user.level, attackingStat, defendingStat, this.move.basePower, multiplier);
            const damageAction = new DamageAction(this.target, damageAmount);
            this.queue?.push(damageAction);
        }
    }
}
export default MoveAction;
