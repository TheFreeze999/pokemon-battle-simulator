import { objectClone } from "./util.js";
import Stats from './Stats.js';
class Battler {
    creature;
    team = null;
    level;
    types;
    moves = [];
    initialStats;
    statBoosts = Stats.BaseStatsWithoutHP.createDefault();
    displayName;
    fainted = false;
    ability;
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
    get hpPercentage() {
        return this.initialStats.currentHp / this.initialStats.hp;
    }
}
export default Battler;
