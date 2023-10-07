import Battle from "./Battle.js";
import Battler from "./Battler.js";
import Creature from "./Creature.js";
import MoveDex from "./dex/MoveDex.js";
import SpeciesDex from "./dex/SpeciesDex.js";
import MoveAction from "./queue/actions/MoveAction.js";

const battle = new Battle();

const creature0 = new Creature(SpeciesDex.fletchling);
const creature1 = new Creature(SpeciesDex.litwick);

creature1.abilitySlot = "secondary";

creature0.moves = [MoveDex.tackle, MoveDex.bite, MoveDex.thunder_shock, MoveDex.energy_ball];
creature1.moves = [MoveDex.accelerock, MoveDex.bite, MoveDex.thunder_shock, MoveDex.shadow_sneak];

creature0.level = 100;
creature1.level = 100;
creature0.calcStats();
creature1.calcStats();

const battler0 = new Battler(creature0);
const battler1 = new Battler(creature1);

battle.teams[0].addBattler(battler0);
battle.teams[1].addBattler(battler1);

/* battle.queue.push(
	new MoveAction(battler0, battler1, MoveDex.bite),
	new MoveAction(battler1, battler0, MoveDex.bite),
	new MoveAction(battler0, battler1, MoveDex.bite),
	new MoveAction(battler1, battler0, MoveDex.bite),
	new MoveAction(battler0, battler1, MoveDex.bite),
	new MoveAction(battler1, battler0, MoveDex.bite),
);

await battle.queue.executeAll(); */

// fix bug where flame body will activate even when the move used was stopped by type immunity.

battle.turn.makeSelection(battler0, {
	type: 'move',
	user: battler0,
	target: battler1,
	move: MoveDex.tackle
});
battle.turn.makeSelection(battler1, {
	type: 'move',
	user: battler1,
	target: battler0,
	move: MoveDex.shadow_sneak
});

await battle.turn.concludeActionSelectionPhase();
await battle.turn.concludeMainActionPhase();
await battle.turn.concludePostActionPhase();

battle.turn.makeSelection(battler0, {
	type: 'move',
	user: battler0,
	target: battler1,
	move: MoveDex.tackle
});
battle.turn.makeSelection(battler1, {
	type: 'move',
	user: battler1,
	target: battler0,
	move: MoveDex.shadow_sneak
});

await battle.turn.concludeActionSelectionPhase();
await battle.turn.concludeMainActionPhase();
await battle.turn.concludePostActionPhase();

battle.turn.makeSelection(battler0, {
	type: 'move',
	user: battler0,
	target: battler1,
	move: MoveDex.tackle
});
battle.turn.makeSelection(battler1, {
	type: 'move',
	user: battler1,
	target: battler0,
	move: MoveDex.shadow_sneak
});

await battle.turn.concludeActionSelectionPhase();
await battle.turn.concludeMainActionPhase();
await battle.turn.concludePostActionPhase();
console.log(battle)