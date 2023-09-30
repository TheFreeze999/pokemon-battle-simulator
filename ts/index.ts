import Battle from "./Battle.js";
import Battler from "./Battler.js";
import Creature from "./Creature.js";
import Type, { TypeUtils } from "./Type.js";
import MoveDex from "./dex/MoveDex.js";
import SpeciesDex from "./dex/SpeciesDex.js";
import MoveAction from "./queue/actions/MoveAction.js";
import { delay } from "./util.js";

const battle = new Battle();
const bulba1 = new Creature(SpeciesDex.bulbasaur);
const charma1 = new Creature(SpeciesDex.charmander);

bulba1.moves = [MoveDex.tackle, MoveDex.energy_ball];
charma1.moves = [MoveDex.tackle, MoveDex.flamethrower];

bulba1.level = 100;
bulba1.calcStats();
charma1.level = 100;
charma1.calcStats();

const bulba1Battler = new Battler(bulba1);
const charma1Battler = new Battler(charma1);

battle.teams[0].addBattler(bulba1Battler);
battle.teams[1].addBattler(charma1Battler);

const moveAction = new MoveAction(bulba1Battler, charma1Battler, MoveDex.energy_ball);
const moveAction2 = new MoveAction(charma1Battler, bulba1Battler, MoveDex.tackle);
const moveAction3 = new MoveAction(bulba1Battler, charma1Battler, MoveDex.energy_ball);



battle.queue.push(moveAction, moveAction2, moveAction3);

await battle.queue.executeAll();



console.log(battle)