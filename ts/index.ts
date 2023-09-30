import Battle from "./Battle.js";
import Battler from "./Battler.js";
import Creature from "./Creature.js";
import MoveDex from "./dex/MoveDex.js";
import SpeciesDex from "./dex/SpeciesDex.js";
import MoveAction from "./queue/actions/MoveAction.js";

const battle = new Battle();

const creature0 = new Creature(SpeciesDex.honedge);
const creature1 = new Creature(SpeciesDex.fletchling);

creature0.moves = [MoveDex.tackle, MoveDex.flamethrower, MoveDex.hone_claws, MoveDex.metal_sound];
creature1.moves = [MoveDex.tackle, MoveDex.energy_ball, MoveDex.screech, MoveDex.metal_sound];

creature0.level = 100;
creature1.level = 100;
creature0.calcStats();
creature1.calcStats();

const battler0 = new Battler(creature0);
const battler1 = new Battler(creature1);

battle.teams[0].addBattler(battler1);
battle.teams[1].addBattler(battler0);

battle.queue.push(
	new MoveAction(battler0, battler0, MoveDex.hone_claws),
	new MoveAction(battler1, battler0, MoveDex.energy_ball),
	new MoveAction(battler0, battler1, MoveDex.tackle),
	new MoveAction(battler1, battler0, MoveDex.tackle),
);

await battle.queue.executeAll();

console.log(battle)