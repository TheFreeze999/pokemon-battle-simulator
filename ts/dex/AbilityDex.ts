import Ability from "../Ability.js";
import Move from "../Move.js";
import Type from "../Type.js";
import FlashFireEffect from "../effects/effect_types/FlashFireEffect.js";
import BurnEffect from "../effects/effect_types/status_conditions/BurnEffect.js";
import EffectApplicationAction from "../queue/actions/EffectApplicationAction.js";
import HealAction from "../queue/actions/HealAction.js";
import MoveAction from "../queue/actions/MoveAction.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";
import SwitchInAction from "../queue/actions/SwitchInAction.js";
import AbilityPresets from "./AbilityPresets.js";

namespace AbilityDex {
	export const no_ability = new Ability({
		name: "no_ability",
		displayName: "No Ability"
	});

	export const blaze = new Ability({
		name: "blaze",
		displayName: "Blaze"
	});
	AbilityPresets.powerBoostWithTypeWhenLowHP(blaze, Type.FIRE, 100 / 3);

	export const contrary = new Ability({
		name: "contrary",
		displayName: "Contrary",
		preExecutionModifiers: [
			{
				priority: 0,
				async modify(battleAction, owner) {
					if (!(battleAction instanceof StatStageChangeAction)) return;
					if (battleAction.target !== owner) return;
					battleAction.amount *= -1;
				},
			}
		]
	});

	export const intimidate = new Ability({
		name: "intimidate",
		displayName: "Intimidate",
		postExecutionModifiers: [
			{
				priority: 0,
				async modify(battleAction, owner) {
					if (!(battleAction instanceof SwitchInAction)) return;
					if (battleAction.target !== owner) return;

					const foes = battleAction.target.foes;
					for (const foe of foes) {
						const intimidateAction = new StatStageChangeAction(foe, "attack", -1);
						intimidateAction.priority = 30 - owner.placeInSpeedOrder;
						intimidateAction.eventHandler.addEventListener('before execution', async () => {
							await owner.battle?.renderer.showTextWhilePausingQueue(`[${owner.displayName}'s Intimidate]`, ["ability"]);
						});
						owner.battle?.queue.push(intimidateAction);
					}
				},
			}
		]
	});

	export const no_guard = new Ability({
		name: "no_guard",
		displayName: "No Guard",
		preExecutionModifiers: [
			{
				priority: 0,
				async modify(battleAction, owner) {
					if (!(battleAction instanceof MoveAction)) return;
					console.log(`user: ${battleAction.user.displayName}, targets: ${battleAction.targets.map(t => t.displayName)}`)
					if (battleAction.user === owner) {
						for (const target of battleAction.targets) {
							battleAction.forceMoveHitOnTargets.set(target, true);
						}
					}
					if (battleAction.targets.includes(owner)) {
						battleAction.forceMoveHitOnTargets.set(owner, true);
					}
					console.log(battleAction.forceMoveHitOnTargets)
				},
			}
		]
	});

	export const overgrow = new Ability({
		name: "overgrow",
		displayName: "Overgrow"
	});
	AbilityPresets.powerBoostWithTypeWhenLowHP(overgrow, Type.GRASS, 100 / 3);

	export const sap_sipper = new Ability({
		name: "sap_sipper",
		displayName: "Sap Sipper"
	});
	AbilityPresets.immunityToTypeWithStatBoost(sap_sipper, Type.GRASS, "attack", 1);

	export const simple = new Ability({
		name: "simple",
		displayName: "Simple",
		preExecutionModifiers: [
			{
				priority: 0,
				async modify(battleAction, owner) {
					if (!(battleAction instanceof StatStageChangeAction)) return;
					if (battleAction.target !== owner) return;
					battleAction.amount *= 2;
				},
			}
		]
	});

	export const torrent = new Ability({
		name: "torrent",
		displayName: "Torrent"
	});
	AbilityPresets.powerBoostWithTypeWhenLowHP(torrent, Type.WATER, 100 / 3);

	export const volt_absorb = new Ability({
		name: "volt_absorb",
		displayName: "Volt Absorb"
	});
	AbilityPresets.immunityToTypeWithHealing(volt_absorb, Type.ELECTRIC, 25);

	export const water_absorb = new Ability({
		name: "water_absorb",
		displayName: "Water Absorb"
	});
	AbilityPresets.immunityToTypeWithHealing(water_absorb, Type.WATER, 25);
}

export default AbilityDex;