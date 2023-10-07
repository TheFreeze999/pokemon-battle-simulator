import Battle from "./Battle.js";
import Battler from "./Battler.js";
import Creature from "./Creature.js";
import ItemDex from "./dex/ItemDex.js";
import MoveDex from "./dex/MoveDex.js";
import SpeciesDex from "./dex/SpeciesDex.js";
import { randomArrayElement } from './util.js';
const battle = new Battle();
const creature0 = new Creature(SpeciesDex.fletchling);
const creature1 = new Creature(SpeciesDex.bulbasaur);
creature0.moves = [MoveDex.thunder_shock, MoveDex.willowisp, MoveDex.dragon_rage, MoveDex.bite];
creature1.moves = [MoveDex.dragon_rage, MoveDex.trick];
creature0.heldItem = ItemDex.leftovers;
creature1.heldItem = ItemDex.black_sludge;
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
        target: battler1,
        move: randomArrayElement(battler0.moves)
    });
    battle.turn.makeSelection(battler1, {
        type: 'move',
        user: battler1,
        target: battler0,
        move: randomArrayElement(battler1.moves)
    });
    await battle.turn.concludeActionSelectionPhase();
    await battle.turn.concludeMainActionPhase();
    await battle.turn.concludeFinalPhase();
    if (battle.ended)
        break;
}
console.log(battle);
