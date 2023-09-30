import { clamp } from "./util.js";


function normalizeStats(stats: Record<string, number>) {
	const modifiedStats = { ...stats };

	for (const stat in modifiedStats) {
		modifiedStats[stat] = Math.round(modifiedStats[stat]);
		modifiedStats[stat] = clamp(modifiedStats[stat], -6, 6);
	}

	return modifiedStats;
}
namespace Stats {
	export interface BaseStatsWithoutHP {
		attack: number;
		defense: number;
		specialAttack: number;
		specialDefense: number;
		speed: number;
	}
	export namespace BaseStatsWithoutHP {
		export function createDefault(): BaseStatsWithoutHP {
			return {
				attack: 0,
				defense: 0,
				specialAttack: 0,
				specialDefense: 0,
				speed: 0,
			}
		}
		export function normalize(stats: BaseStatsWithoutHP) {
			return normalizeStats(stats) as BaseStatsWithoutHP;
		}
	}

	export interface BaseStats extends BaseStatsWithoutHP {
		hp: number;
	}
	export namespace BaseStats {
		export function createDefault(): BaseStats {
			return {
				hp: 0,
				attack: 0,
				defense: 0,
				specialAttack: 0,
				specialDefense: 0,
				speed: 0,
			}
		}
		export function normalize(stats: BaseStats) {
			return normalizeStats(stats) as BaseStats;
		}
	}

	export interface CreatureStats extends BaseStats {
		currentHp: number;
	}
	export namespace CreatureStats {
		export function createDefault(): CreatureStats {
			return {
				currentHp: 0,
				hp: 0,
				attack: 0,
				defense: 0,
				specialAttack: 0,
				specialDefense: 0,
				speed: 0,
			}
		}
		export function normalize(stats: CreatureStats) {
			return normalizeStats(stats) as CreatureStats;
		}
	}

	export function toDisplayName(stat: keyof CreatureStats) {
		if (stat === "currentHp") return "Current HP";
		if (stat === "hp") return "HP";
		if (stat === "attack") return "Attack";
		if (stat === "defense") return "Defense";
		if (stat === "specialAttack") return "Special Attack";
		if (stat === "specialDefense") return "Special Defense";

		return "Speed";
	}

	export function getStatStageChangeInfoText(displayName: string, stat: keyof BaseStatsWithoutHP, amount: number) {
		const statDisplayName = toDisplayName(stat);
		if (amount === 1) return `${displayName}'s ${statDisplayName} rose!`;
		if (amount === 2) return `${displayName}'s ${statDisplayName} rose sharply!`;
		if (amount > 2) return `${displayName}'s ${statDisplayName} rose drastically!`;
		if (amount === -1) return `${displayName}'s ${statDisplayName} fell!`;
		if (amount === -2) return `${displayName}'s ${statDisplayName} harshly fell!`;
		if (amount < -2) return `${displayName}'s ${statDisplayName} severely fell!`;
		return null;
	}


}

export default Stats;