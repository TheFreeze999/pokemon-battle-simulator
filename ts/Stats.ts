import { clamp } from "./util.js";



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
		/**
		 * @param mode Input 1 to only return positive stats, input -1 to only return negative stats.
		 */
		export function getOnlyPositiveOrNegative(stats: BaseStatsWithoutHP, mode: 1 | -1) {
			const onlyPositiveStats = Stats.BaseStatsWithoutHP.createDefault();
			for (const _stat in stats) {
				const stat = _stat as keyof BaseStatsWithoutHP;
				if (mode === 1)
					onlyPositiveStats[stat] = clamp(stats[stat], 0, 6);
				else
					onlyPositiveStats[stat] = clamp(stats[stat], -6, 0);
			}
			return onlyPositiveStats;
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
	}

	export interface AccuracyEvasionStats {
		accuracy: number,
		evasion: number
	}
	export namespace AccuracyEvasionStats {
		export function createDefault(): AccuracyEvasionStats {
			return {
				accuracy: 0,
				evasion: 0
			}
		}
	}

	export type AnyTypeOfStats = BaseStatsWithoutHP | BaseStats | CreatureStats | AccuracyEvasionStats;

	export function normalize(stats: BaseStatsWithoutHP): BaseStatsWithoutHP;
	export function normalize(stats: BaseStats): BaseStats;
	export function normalize(stats: CreatureStats): CreatureStats;
	export function normalize(stats: AccuracyEvasionStats): AccuracyEvasionStats;
	export function normalize(stats: Record<string, number>) {
		const modifiedStats = { ...stats };

		for (const stat in modifiedStats) {
			modifiedStats[stat] = Math.round(modifiedStats[stat]);
			modifiedStats[stat] = clamp(modifiedStats[stat], -6, 6);
		}

		return modifiedStats;
	}

	export function toDisplayName(stat: keyof (CreatureStats & AccuracyEvasionStats)) {
		if (stat === "currentHp") return "Current HP";
		if (stat === "hp") return "HP";
		if (stat === "attack") return "Attack";
		if (stat === "defense") return "Defense";
		if (stat === "specialAttack") return "Special Attack";
		if (stat === "specialDefense") return "Special Defense";
		if (stat === "accuracy") return "Accuracy";
		if (stat === "evasion") return "Evasion";

		return "Speed";
	}

	export function getStatStageChangeInfoText(displayName: string, stat: keyof (BaseStatsWithoutHP & AccuracyEvasionStats), amount: number) {
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