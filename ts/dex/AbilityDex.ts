import Ability from "../Ability.js";
import Type from "../Type.js";
import FlashFireEffect from "../effects/effect_types/FlashFireEffect.js";
import BurnEffect from "../effects/effect_types/status_conditions/BurnEffect.js";
import DamageAction from "../queue/actions/DamageAction.js";
import EffectApplicationAction from "../queue/actions/EffectApplicationAction.js";
import HealAction from "../queue/actions/HealAction.js";
import MoveAction from "../queue/actions/MoveAction.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";

namespace AbilityDex {
	export const no_ability = new Ability({
		name: "no_ability",
		displayName: "No Ability"
	});
	export const big_pecks = new Ability({
		name: "big_pecks",
		displayName: "Big Pecks",
		battleActionModifiers: [
			{
				priority: 0,
				modify(battleAction, owner) {
					if (!(battleAction instanceof StatStageChangeAction)) return;
					if (battleAction.target !== owner) return;
					if (battleAction.stat !== "defense" || battleAction.amount > 0) return;
					battleAction.toExecute = false;
					console.log(`[${owner.displayName}'s Big Pecks]`);
					console.log(`${owner.displayName}'s defense was not lowered.`);
				}
			}
		]
	});
	export const blaze = new Ability({
		name: "blaze",
		displayName: "Blaze",
		battleActionModifiers: [
			{
				priority: 0,
				modify(battleAction, owner) {
					if (!(battleAction instanceof MoveAction)) return;
					if (battleAction.user !== owner) return;
					if (owner.hpPercentage > (100 / 3)) return;
					if (battleAction.move.type !== Type.FIRE) return;

					battleAction.attackStatMultiplier *= 1.5;
				}
			}
		]
	});
	export const compound_eyes = new Ability({
		name: "compound_eyes",
		displayName: "Compound Eyes",
		battleActionModifiers: [
			{
				priority: 0,
				modify(battleAction, owner) {
					if (!(battleAction instanceof MoveAction)) return;
					if (battleAction.user !== owner) return;

					battleAction.accuracyMultiplier *= 1.3;
				}
			}
		]
	});
	export const flash_fire = new Ability({
		name: "flash_fire",
		displayName: "Flash Fire",
		battleActionModifiers: [
			{
				priority: 0,
				modify(battleAction, owner) {
					if (!(battleAction instanceof MoveAction)) return;
					if (battleAction.target !== owner) return;
					if (battleAction.user === owner) return;
					if (battleAction.move.type !== Type.FIRE) return;

					console.log("flashfire should activate")

					battleAction.negateDirectDamage = true;
					battleAction.performSecondaryEffects = false;
					battleAction.showTypeEffectivenessInfoText = false;

					const flashFireEffectAction = new EffectApplicationAction(owner, new FlashFireEffect());
					flashFireEffectAction.priority = 15;
					flashFireEffectAction.cause = battleAction;
					flashFireEffectAction.eventHandler.addEventListener('before execution', () => {
						console.log(`[${owner.displayName}'s Flash Fire]`);
					});
					battleAction.queue?.push(flashFireEffectAction);
				}
			}
		]
	});
	export const flame_body = new Ability({
		name: "flame_body",
		displayName: "Flame Body",
		battleActionModifiers: [
			{
				priority: 0,
				modify(battleAction, owner) {
					if (!(battleAction instanceof MoveAction)) return;
					if (battleAction.target !== owner) return;
					if (battleAction.user === owner) return;
					if (!battleAction.move.contact) return;

					const burnAction = new EffectApplicationAction(battleAction.user, new BurnEffect());
					burnAction.priority = 4;
					burnAction.cause = battleAction;
					burnAction.chance = [100, 100];
					burnAction.eventHandler.addEventListener('before execution', () => {
						console.log(`[${owner.displayName}'s Flame Body]`);
					});
					battleAction.queue?.push(burnAction);
				}
			}
		]
	});
	export const no_guard = new Ability({
		name: "no_guard",
		displayName: "No Guard",
		battleActionModifiers: [
			{
				priority: 0,
				modify(battleAction, owner) {
					if (!(battleAction instanceof MoveAction)) return;
					if (battleAction.user !== owner && battleAction.target !== owner) return;

					battleAction.forceMoveHit = true;
				}
			}
		]
	});
	export const overgrow = new Ability({
		name: "overgrow",
		displayName: "Overgrow",
		battleActionModifiers: [
			{
				priority: 0,
				modify(battleAction, owner) {
					if (!(battleAction instanceof MoveAction)) return;
					if (battleAction.user !== owner) return;
					if (owner.hpPercentage > (100 / 3)) return;
					if (battleAction.move.type !== Type.GRASS) return;

					battleAction.attackStatMultiplier *= 1.5;
				}
			}
		]
	});
	export const sap_sipper = new Ability({
		name: "sap_sipper",
		displayName: "Sap Sipper",
		battleActionModifiers: [
			{
				priority: 0,
				modify(battleAction, owner) {
					if (!(battleAction instanceof MoveAction)) return;
					if (battleAction.target !== owner) return;
					if (battleAction.user === owner) return;
					if (battleAction.move.type !== Type.GRASS) return;

					battleAction.negateDirectDamage = true;
					battleAction.performSecondaryEffects = false;
					battleAction.showTypeEffectivenessInfoText = false;
					const statBoostAction = new StatStageChangeAction(owner, "attack", 1);
					statBoostAction.priority = 15;
					statBoostAction.cause = battleAction;
					statBoostAction.eventHandler.addEventListener('before execution', () => {
						console.log(`[${owner.displayName}'s Sap Sipper]`);
					});
					battleAction.queue?.push(statBoostAction);
				}
			}
		]
	});
	export const torrent = new Ability({
		name: "torrent",
		displayName: "Torrent",
		battleActionModifiers: [
			{
				priority: 0,
				modify(battleAction, owner) {
					if (!(battleAction instanceof MoveAction)) return;
					if (battleAction.user !== owner) return;
					if (owner.hpPercentage > (100 / 3)) return;
					if (battleAction.move.type !== Type.WATER) return;

					battleAction.attackStatMultiplier *= 1.5;
				}
			}
		]
	});
	export const volt_absorb = new Ability({
		name: "volt_absorb",
		displayName: "Volt Absorb",
		battleActionModifiers: [
			{
				priority: 0,
				modify(battleAction, owner) {
					if (!(battleAction instanceof MoveAction)) return;
					if (battleAction.target !== owner) return;
					if (battleAction.user === owner) return;
					if (battleAction.move.type !== Type.ELECTRIC) return;


					battleAction.negateDirectDamage = true;
					battleAction.performSecondaryEffects = false;
					battleAction.showTypeEffectivenessInfoText = false;

					const healAmount = Math.floor(battleAction.target.initialStats.hp / 4);
					const healAction = new HealAction(battleAction.target, healAmount)
					healAction.priority = 15;
					healAction.cause = battleAction;
					healAction.eventHandler.addEventListener('before execution', () => {
						console.log(`[${owner.displayName}'s Volt Absorb]`);
					});
					battleAction.queue?.push(healAction);
				}
			}
		]
	});
	export const water_absorb = new Ability({
		name: "water_absorb",
		displayName: "Water Absorb",
		battleActionModifiers: [
			{
				priority: 0,
				modify(battleAction, owner) {
					if (!(battleAction instanceof MoveAction)) return;
					if (battleAction.target !== owner) return;
					if (battleAction.user === owner) return;
					if (battleAction.move.type !== Type.WATER) return;

					battleAction.negateDirectDamage = true;
					battleAction.performSecondaryEffects = false;
					battleAction.showTypeEffectivenessInfoText = false;

					const healAmount = Math.floor(battleAction.target.initialStats.hp / 4);
					const healAction = new HealAction(battleAction.target, healAmount)
					healAction.priority = 15;
					healAction.cause = battleAction;
					healAction.eventHandler.addEventListener('before execution', () => {
						console.log(`[${owner.displayName}'s Water Absorb]`);
					});
					battleAction.queue?.push(healAction);
				}
			}
		]
	});
}

export default AbilityDex;