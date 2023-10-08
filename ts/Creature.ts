import Item from "./Item.js";
import Move from "./Move.js";
import Species from "./Species.js";
import Stats from "./Stats.js";
import AbilityDex from "./dex/AbilityDex.js";

class Creature {
	level = 1;
	moves: Move[] = [];
	movePp = new Map<Move, number>();
	stats = Stats.CreatureStats.createDefault();
	evSpread = Stats.BaseStats.createDefault();
	ivSpread = Stats.BaseStats.createDefault();
	abilitySlot: keyof Required<Species["abilities"]> = "primary";
	heldItem: Item | null = null;

	constructor(public readonly species: Species) {
		this.calcStats();
		this.stats.currentHp = this.stats.hp;
	}

	calcStats() {
		const stats = Stats.BaseStats.createDefault();
		stats.hp = Math.floor((2 * this.species.baseStats.hp + this.ivSpread.hp + Math.floor(this.evSpread.hp / 4)) * this.level / 100) + this.level + 10;

		const nonHPStats = Object.keys(Stats.BaseStatsWithoutHP.createDefault()) as (keyof Stats.BaseStatsWithoutHP)[];

		for (const stat of nonHPStats) {
			const base = this.species.baseStats[stat];
			const iv = this.ivSpread[stat];
			const ev = this.evSpread[stat];
			/* Add nature code later */
			const nature = 1;

			stats[stat] = Math.floor((Math.floor((2 * base + iv + Math.floor(ev / 4)) * this.level / 100) + 5) * nature)
		}

		const oldHpPercentage = this.stats.currentHp / this.stats.hp;
		const currentHp = Math.floor(oldHpPercentage * stats.hp);
		this.stats = { currentHp, ...stats };

		return stats;
	}

	addMoves(...moves: Move[]) {
		moves.forEach(move => {
			this.moves.push(move);
			this.movePp.set(move, move.pp);
		})
	}

	get ability() {
		return this.species.abilities[this.abilitySlot] || AbilityDex.no_ability;
	}
}

export default Creature;