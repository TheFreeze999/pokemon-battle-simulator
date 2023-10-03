import Team from "./Team.js";
import Creature from "./Creature.js";
import Type from "./Type.js";
import { clamp, objectClone, removeNullAndUndefined } from "./util.js";
import Move from "./Move.js";
import Stats from './Stats.js';
import Ability from "./Ability.js";
import Effect from "./effects/Effect.js";

class Battler {
	team: Team | null = null;
	level: number;
	types: Type[];
	initialStats: Stats.CreatureStats;
	statBoosts = Stats.BaseStatsWithoutHP.createDefault();
	accuracyEvasionBoosts = Stats.AccuracyEvasionStats.createDefault();
	criticalHitRatio = 0;
	displayName: string;
	ability: Ability;
	fainted = false;

	moves: Move[] = [];

	effects: Effect[] = [];

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

	getEffectiveStats(statBoosts = this.statBoosts) {
		const stats = objectClone(this.initialStats);

		const boostableStatNames = Object.keys(statBoosts) as (keyof Stats.BaseStatsWithoutHP)[]
		for (const statName of boostableStatNames) {
			const boost = statBoosts[statName];
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

	getEffectiveAccuracyAndEvasion() {
		const stats = objectClone(this.accuracyEvasionBoosts);
		const boostableStatNames = Object.keys(this.accuracyEvasionBoosts) as (keyof Stats.AccuracyEvasionStats)[]
		for (const statName of boostableStatNames) {
			const boost = this.accuracyEvasionBoosts[statName];
			const boostAbs = Math.abs(boost);
			let numerator = 3;
			let denominator = 3;
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

	/** @returns true if effect was added successfully */
	addEffect(effect: Effect) {
		if (!effect.stackable && this.hasEffect(effect.type)) return false;
		effect.host = this;
		this.effects.push(effect);
		effect.eventHandler.dispatchEvent('application', this);
		return true;
	}

	/** @returns true if effect was removed successfully */
	removeEffect(effect: Effect) {
		const index = this.effects.indexOf(effect);
		if (index < 0) return false;

		effect.host = null;
		this.effects.splice(index, 1);

		return true;
	}

	hasEffect(type: string) {
		return this.effects.some(effect => effect.type === type);
	}
}

export default Battler;