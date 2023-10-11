import Battle from "./Battle.js";
import Battler from "./Battler.js";
import Creature from "./Creature.js";
import Move from "./Move.js";
import Turn from "./Turn.js";
import MoveDex from "./dex/MoveDex.js";
import SpeciesDex from "./dex/SpeciesDex.js";
import { randomArrayElement } from './util.js';
const battle = new Battle();
const creature0 = new Creature(SpeciesDex.jolteon);
const creature1 = new Creature(SpeciesDex.jolteon);
creature0.addMoves(MoveDex.energy_ball);
creature1.addMoves(MoveDex.energy_ball);
creature0.level = 100;
creature1.level = 100;
creature0.calcStats();
creature1.calcStats();
const battler0 = new Battler(creature0);
const battler1 = new Battler(creature1);
battle.teams[0].addBattler(battler0);
battle.teams[1].addBattler(battler1);
battle.start();
await battle.turn.performPreStartPhase();
while (true) {
    if (battle.turn.phase !== Turn.Phase.ACTION_SELECTION)
        break;
    await battle.turn.performActionSelectionPhase();
    battle.allSwitchedIn.forEach(battler => {
        const move = randomArrayElement(battler.usableMoves);
        let targets;
        const opponent = battler.team?.enemyTeam.switchedInBattler;
        if (move.targeting === Move.Targeting.ONE_OTHER && opponent)
            targets = [opponent];
        else if (move.targeting === Move.Targeting.SELF)
            targets = [battler];
        else
            targets = [];
        battle.turn.makeSelection(battler, {
            type: 'move',
            user: battler,
            targets,
            move
        });
    });
    await battle.turn.performMainActionPhase();
    await battle.turn.performFinalPhase();
    if (battle.ended)
        break;
}
console.log(battle);
