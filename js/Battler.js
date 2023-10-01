import { objectClone } from "./util.js";
import Stats from './Stats.js';
class Battler {
    creature;
    team = null;
    level;
    types;
    initialStats;
    statBoosts = Stats.BaseStatsWithoutHP.createDefault();
    accuracyEvasionBoosts = Stats.AccuracyEvasionStats.createDefault();
    displayName;
    ability;
    fainted = false;
    moves = [];
    effects = [];
    constructor(creature) {
        this.creature = creature;
        this.level = this.creature.level;
        this.types = this.creature.species.types;
        this.moves = this.creature.moves;
        this.initialStats = this.creature.stats;
        this.displayName = this.creature.species.displayName;
        this.ability = this.creature.ability;
    }
    get battle() {
        return this.team?.battle || null;
    }
    get allies() {
        if (!this.team || !this.battle)
            return [];
        return this.team.battlers.filter(battler => battler !== this);
    }
    get foes() {
        if (!this.team || !this.battle)
            return [];
        return this.team.enemyTeam.battlers;
    }
    getEffectiveStats() {
        const stats = objectClone(this.initialStats);
        const boostableStatNames = Object.keys(this.statBoosts);
        for (const statName of boostableStatNames) {
            const boost = this.statBoosts[statName];
            const boostAbs = Math.abs(boost);
            let numerator = 2;
            let denominator = 2;
            if (boost > 0)
                numerator += boostAbs;
            else
                denominator += boostAbs;
            stats[statName] *= (numerator / denominator);
            stats[statName] = Math.round(stats[statName]);
        }
        return stats;
    }
    getEffectiveAccuracyAndEvasion() {
        const stats = objectClone(this.accuracyEvasionBoosts);
        const boostableStatNames = Object.keys(this.accuracyEvasionBoosts);
        for (const statName of boostableStatNames) {
            const boost = this.accuracyEvasionBoosts[statName];
            const boostAbs = Math.abs(boost);
            let numerator = 3;
            let denominator = 3;
            if (boost > 0)
                numerator += boostAbs;
            else
                denominator += boostAbs;
            stats[statName] *= (numerator / denominator);
            stats[statName] = Math.round(stats[statName]);
        }
        return stats;
    }
    get hpPercentage() {
        return this.initialStats.currentHp / this.initialStats.hp * 100;
    }
    addEffect(effect) {
        effect.host = this;
        this.effects.push(effect);
    }
    /** @returns true if effect was removed successfully */
    removeEffect(effect) {
        const index = this.effects.indexOf(effect);
        if (index < 0)
            return false;
        effect.host = null;
        this.effects.splice(index, 1);
        return true;
    }
    hasEffect(type) {
        return this.effects.some(effect => effect.type === type);
    }
}
export default Battler;
