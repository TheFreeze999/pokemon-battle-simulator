import Team from "./Team.js";
import Creature from "./Creature.js";
import Type from "./Type.js";
import { objectClone, removeNullAndUndefined } from "./util.js";
import Move from "./Move.js";
import Stats from './Stats.js';

class Battler {
	team: Team | null = null;
	level: number;
	types: Type[];
	moves: Move[] = [];
	stats: Stats.CreatureStats;
	statBoosts: Stats.BaseStatsWithoutHP = Stats.BaseStatsWithoutHP.createDefault();
	name: string;
	fainted = false;

	constructor(public readonly creature: Creature) {
		this.level = creature.level;
		this.types = creature.species.types;
		this.moves = creature.moves;
		this.stats = creature.stats;
		this.name = creature.species.name;
	}

	get battle() {
		return this.team?.battle || null;
	}

	get allies(): Battler[] {
		if (!this.team || !this.battle) return [];
		return this.team.battlers.filter(battler => battler !== this);
	}
	get foes(): Battler[] {
		if (!this.team || !this.battle) return [];
		return this.team.enemyTeam.battlers;
	}

	calcBoostedStats() {
		const stats = objectClone(this.stats);
		const boostableStatNames = Object.keys(this.statBoosts) as (keyof Stats.BaseStatsWithoutHP)[]
		for (const statName of boostableStatNames) {
			const boost = this.statBoosts[statName];
			const boostAbs = Math.abs(boost);
			let numerator = 2;
			let denominator = 2;
			if (boost > 0) numerator += boostAbs;
			else denominator += boostAbs;
			stats[statName] *= (numerator / denominator);
			stats[statName] = Math.round(stats[statName]);
		}

		return stats;
	}
}

export default Battler;