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
}

export default Stats;