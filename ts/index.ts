import Battle from "./Battle.js";
import Battler from "./Battler.js";
import Creature from "./Creature.js";
import Move from "./Move.js";
import ItemDex from "./dex/ItemDex.js";
import MoveDex from "./dex/MoveDex.js";
import SpeciesDex from "./dex/SpeciesDex.js";
import MoveAction from "./queue/actions/MoveAction.js";
import { randomArrayElement, mapNumberInRange } from './util.js';

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

battle.start();

console.log(battle.allSwitchedIn)

while (true) {
	battle.allSwitchedIn.forEach(battler => {
		const move = randomArrayElement(battler.usableMoves);
		let targets: Battler[];
		const opponent = battler.team?.enemyTeam.switchedInBattler;

		if (move.targeting === Move.Targeting.ENEMY && opponent) targets = [opponent];
		else if (move.targeting === Move.Targeting.SELF) targets = [battler];
		else targets = [];

		battle.turn.makeSelection(battler, {
			type: 'move',
			user: battler,
			targets,
			move
		});
	});

	await battle.turn.concludeActionSelectionPhase();
	await battle.turn.concludeMainActionPhase();
	await battle.turn.concludeFinalPhase();

	if (battle.ended) break;
}


console.log(battle)