import { objectClone } from "./util.js";
import Stats from './Stats.js';
class Battler {
    creature;
    team = null;
    level;
    types;
    moves = [];
    stats;
    statBoosts = Stats.BaseStatsWithoutHP.createDefault();
    displayName;
    fainted = false;
    constructor(creature) {
        this.creature = creature;
        this.level = creature.level;
        this.types = creature.species.types;
        this.moves = creature.moves;
        this.stats = creature.stats;
        this.displayName = creature.species.displayName;
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
    calcBoostedStats() {
        const stats = objectClone(this.stats);
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
}
export default Battler;
