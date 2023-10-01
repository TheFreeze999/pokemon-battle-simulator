import Move from "../../Move.js";
import { TypeUtils } from "../../Type.js";
import { randomInteger } from "../../util.js";
import BattleAction from "../BattleAction.js";
import DamageAction from "./DamageAction.js";
class MoveAction extends BattleAction {
    user;
    target;
    move;
    attackStatMultiplier = 1;
    accuracyMultiplier = 1;
    directDamageMultiplier = 1;
    forceMoveHit = false;
    negateDirectDamage = false;
    performSecondaryEffects = true;
    showTypeEffectivenessInfoText = true;
    missed = false;
    constructor(user, target, move) {
        super();
        this.user = user;
        this.target = target;
        this.move = move;
    }
    clause() {
        if (this.user.fainted || this.target.fainted)
            return false;
        if (!this.user.moves.includes(this.move))
            return false;
        return true;
    }
    async execute() {
        console.log("-------------");
        if (this.user === this.target)
            console.log(`${this.user.displayName} used ${this.move.displayName}!`);
        else
            console.log(`${this.user.displayName} used ${this.move.displayName} on ${this.target.displayName}!`);
        const moveHit = this.didMoveHit();
        if (!moveHit) {
            console.log(`The move missed!`);
            this.missed = true;
            return;
        }
        if (this.move.category !== Move.Category.STATUS && this.move.basePower !== undefined && this.move.dealDirectDamage) {
            const userBoostedStats = this.user.getEffectiveStats();
            const targetBoostedStats = this.target.getEffectiveStats();
            let attackingStat = this.move.category === Move.Category.PHYSICAL ? userBoostedStats.attack : userBoostedStats.specialAttack;
            const defendingStat = this.move.category === Move.Category.PHYSICAL ? targetBoostedStats.defense : targetBoostedStats.specialDefense;
            attackingStat *= this.attackStatMultiplier;
            const typeEffectiveness = TypeUtils.calculateEffectiveness([this.move.type], this.target.types);
            const stab = this.user.types.includes(this.move.type) ? 1.5 : 1;
            const multiplier = typeEffectiveness * stab * this.directDamageMultiplier;
            const typeEffectivenessInfoText = TypeUtils.getInfoFromEffectiveness(typeEffectiveness);
            if (typeEffectivenessInfoText && this.showTypeEffectivenessInfoText)
                console.log(typeEffectivenessInfoText);
            if (typeEffectiveness !== 0 && !this.negateDirectDamage) {
                const damageAmount = Move.standardDamageCalculation(this.user.level, attackingStat, defendingStat, this.move.basePower, multiplier);
                const damageAction = new DamageAction(this.target, damageAmount);
                damageAction.priority = 5;
                damageAction.isDirectDamage = true;
                this.queue?.push(damageAction);
            }
        }
        if (this.performSecondaryEffects) {
            this.move.applySecondaryEffects(this);
        }
    }
    didMoveHit() {
        let accuracy = this.move.accuracy;
        if (this.forceMoveHit === true)
            return true;
        if (accuracy < 0)
            return true;
        const random = randomInteger(1, 100);
        const attackerAccuracy = this.user.getEffectiveAccuracyAndEvasion().accuracy;
        const defenderEvasion = this.target.getEffectiveAccuracyAndEvasion().evasion;
        if (defenderEvasion > 0) {
            const fraction = attackerAccuracy / defenderEvasion;
            accuracy *= fraction;
        }
        accuracy *= this.accuracyMultiplier;
        return random <= accuracy;
    }
}
export default MoveAction;
