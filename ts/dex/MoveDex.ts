import Move from "../Move.js";
import Stats from "../Stats.js";
import Type, { TypeUtils } from "../Type.js";
import DamageAction from "../queue/actions/DamageAction.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";
import SwitchInAction from "../queue/actions/SwitchInAction.js";

namespace MoveDex {
	export const accelerock = new Move({
		name: "accelerock",
		displayName: "Accelerock",
		type: Type.ROCK,
		category: Move.Category.PHYSICAL,
		basePower: 40,
		accuracy: 100,
		contact: true,
		priority: 1,
		pp: 20,
	});

	export const energy_ball = new Move({
		name: "energy_ball",
		displayName: "Energy Ball",
		type: Type.GRASS,
		category: Move.Category.SPECIAL,
		basePower: 90,
		accuracy: 100,
		pp: 10,
		async applySecondaryEffects(moveAction) {
			const target = moveAction.targets[0];
			if (!moveAction.isSuccessfulOn(target)) return;

			const statDropAction = new StatStageChangeAction(target, "specialDefense", -1);
			statDropAction.priority = 30;
			statDropAction.chance = [10, 100];
			statDropAction.cause = moveAction;
			moveAction.queue?.push(statDropAction);
		},
	});
	export const flamethrower = new Move({
		name: "flamethrower",
		displayName: "Flamethrower",
		type: Type.FIRE,
		category: Move.Category.SPECIAL,
		basePower: 90,
		accuracy: 100,
		pp: 15,
	});
	export const shell_smash = new Move({
		name: "shell_smash",
		displayName: "Shell Smash",
		type: Type.NORMAL,
		category: Move.Category.STATUS,
		accuracy: -1,
		targeting: Move.Targeting.SELF,
		pp: 15,
		async applySecondaryEffects(moveAction) {
			const defensiveStats = ['defense', 'specialDefense'] as (keyof Stats.BaseStatsWithoutHP)[];
			const offensiveStats = ['attack', 'specialAttack', 'speed'] as (keyof Stats.BaseStatsWithoutHP)[];

			for (const defensiveStat of defensiveStats) {
				const statDropAction = new StatStageChangeAction(moveAction.user, defensiveStat, -1);
				statDropAction.cause = moveAction;
				statDropAction.priority = 30;
				moveAction.queue?.push(statDropAction);
			}
			for (const offensiveStat of offensiveStats) {
				const statDropAction = new StatStageChangeAction(moveAction.user, offensiveStat, 2);
				statDropAction.cause = moveAction;
				statDropAction.priority = 30;
				moveAction.queue?.push(statDropAction);
			}
		},
	});
	export const struggle = new Move({
		name: "struggle",
		displayName: "Struggle",
		type: Type.NORMAL,
		category: Move.Category.PHYSICAL,
		basePower: 50,
		accuracy: -1,
		contact: true,
		priority: 1,
		pp: -1,
		ignoreTypeEffectiveness: true,
		async applySecondaryEffects(moveAction) {
			const recoilAmount = Math.round(moveAction.user.initialStats.hp / 4);
			const recoilAction = new DamageAction(moveAction.user, recoilAmount);
			recoilAction.cause = moveAction;
			recoilAction.priority = 40;
			recoilAction.textControls.showHpLostText = false;
			recoilAction.textControls.showHpRemainingText = false;
			recoilAction.eventHandler.addEventListener('before execution', async () => {
				await moveAction.queue?.battle.renderer.showTextWhilePausingQueue(`${moveAction.user.displayName} lost some HP due to recoil.`)
			})
			moveAction.queue?.push(recoilAction);
		},
	});
	export const surf = new Move({
		name: "surf",
		displayName: "Surf",
		type: Type.WATER,
		category: Move.Category.SPECIAL,
		basePower: 90,
		accuracy: 100,
		pp: 15,
	});
	export const thunderbolt = new Move({
		name: "thunderbolt",
		displayName: "Thunderbolt",
		type: Type.ELECTRIC,
		category: Move.Category.SPECIAL,
		basePower: 90,
		accuracy: 100,
		pp: 15,
	});
}

export default MoveDex;