import Battle from "./Battle.js";
import Battler from "./Battler.js";
import Creature from "./Creature.js";
import MoveDex from "./dex/MoveDex.js";
import SpeciesDex from "./dex/SpeciesDex.js";
import MoveAction from "./queue/actions/MoveAction.js";

const battle = new Battle();

const creature0 = new Creature(SpeciesDex.squirtle);
const creature1 = new Creature(SpeciesDex.jolteon);

// creature1.abilitySlot = "secondary";

creature0.moves = [MoveDex.tackle, MoveDex.surf, MoveDex.thunder_shock, MoveDex.energy_ball];
creature1.moves = [MoveDex.tackle, MoveDex.surf, MoveDex.thunder_shock, MoveDex.energy_ball];

creature0.level = 100;
creature1.level = 100;
creature0.calcStats();
creature1.calcStats();

const battler0 = new Battler(creature0);
const battler1 = new Battler(creature1);

battle.teams[0].addBattler(battler0);
battle.teams[1].addBattler(battler1);

battle.queue.push(
	new MoveAction(battler0, battler1, MoveDex.thunder_shock),
	new MoveAction(battler1, battler0, MoveDex.tackle),
);

await battle.queue.executeAll();

console.log(battle)