import Battle from "./Battle.js";
import Battler from "./Battler.js";
import Creature from "./Creature.js";
import ItemDex from "./dex/ItemDex.js";
import MoveDex from "./dex/MoveDex.js";
import SpeciesDex from "./dex/SpeciesDex.js";
import MoveAction from "./queue/actions/MoveAction.js";
import { randomArrayElement } from './util.js';

const battle = new Battle();

const creature0 = new Creature(SpeciesDex.jolteon);
const creature1 = new Creature(SpeciesDex.jolteon);


creature0.addMoves(MoveDex.accelerock);
creature1.addMoves(MoveDex.accelerock);

creature0.heldItem = ItemDex.leftovers;
creature1.heldItem = ItemDex.leftovers;

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

battle.start();

while (true) {
	battle.turn.makeSelection(battler0, {
		type: 'move',
		user: battler0,
		targets: [battler1],
		move: randomArrayElement(battler0.usableMoves)
	});
	battle.turn.makeSelection(battler1, {
		type: 'move',
		user: battler1,
		targets: [battler0],
		move: randomArrayElement(battler1.usableMoves)
	});

	await battle.turn.concludeActionSelectionPhase();
	await battle.turn.concludeMainActionPhase();
	await battle.turn.concludeFinalPhase();

	if (battle.ended) break;
}


console.log(battle)