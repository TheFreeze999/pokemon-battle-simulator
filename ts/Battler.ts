import Team from "./Team.js";
import Creature from "./Creature.js";
import Type from "./Type.js";
import { objectClone, removeNullAndUndefined } from "./util.js";
import Move from "./Move.js";
import Stats from './Stats.js';
import Ability from "./Ability.js";

class Battler {
	team: Team | null = null;
	level: number;
	types: Type[];
	initialStats: Stats.CreatureStats;
	statBoosts: Stats.BaseStatsWithoutHP = Stats.BaseStatsWithoutHP.createDefault();
	displayName: string;
	ability: Ability;

	moves: Move[] = [];
	fainted = false;

	constructor(public readonly creature: Creature) {
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

	get allies(): Battler[] {
		if (!this.team || !this.battle) return [];
		return this.team.battlers.filter(battler => battler !== this);
	}
	get foes(): Battler[] {
		if (!this.team || !this.battle) return [];
		return this.team.enemyTeam.battlers;
	}

	getEffectiveStats() {
		const stats = objectClone(this.initialStats);
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

	get hpPercentage() {
		return this.initialStats.currentHp / this.initialStats.hp * 100;
	}
}

export default Battler;