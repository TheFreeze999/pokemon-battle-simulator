import Stats from "./Stats.js";
import AbilityDex from "./dex/AbilityDex.js";
class Creature {
    species;
    level = 1;
    moves = [];
    stats = Stats.CreatureStats.createDefault();
    evSpread = Stats.BaseStats.createDefault();
    ivSpread = Stats.BaseStats.createDefault();
    abilitySlot = "secondary";
    constructor(species) {
        this.species = species;
        this.calcStats();
        this.stats.currentHp = this.stats.hp;
    }
    calcStats() {
        const stats = Stats.BaseStats.createDefault();
        stats.hp = Math.floor((2 * this.species.baseStats.hp + this.ivSpread.hp + Math.floor(this.evSpread.hp / 4)) * this.level / 100) + this.level + 10;
        const nonHPStats = Object.keys(Stats.BaseStatsWithoutHP.createDefault());
        for (const stat of nonHPStats) {
            const base = this.species.baseStats[stat];
            const iv = this.ivSpread[stat];
            const ev = this.evSpread[stat];
            /* Add nature code later */
            const nature = 1;
            stats[stat] = Math.floor((Math.floor((2 * base + iv + Math.floor(ev / 4)) * this.level / 100) + 5) * nature);
        }
        const oldHpPercentage = this.stats.currentHp / this.stats.hp;
        const currentHp = Math.floor(oldHpPercentage * stats.hp);
        this.stats = { currentHp, ...stats };
        return stats;
    }
    get ability() {
        return this.species.abilities[this.abilitySlot] || AbilityDex.noAbility;
    }
}
export default Creature;
