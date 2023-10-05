import Events from "./Events.js";
import Team from "./Team.js";
import Turn from "./Turn.js";
import BattleQueue from "./queue/BattleQueue.js";
class Battle {
    teams = [
        new Team(this),
        new Team(this)
    ];
    queue = new BattleQueue(this);
    turn = new Turn(this, 0);
    eventHandler = new Events.Handler();
    constructor() {
        this.eventHandler.dispatchEvent('new turn');
    }
    get allBattlers() {
        return this.teams.flatMap(team => team.battlers);
    }
    start() {
        this.teams.forEach(team => team.battlers[0].switchedIn = true);
    }
    sortSwitchedInBattlersBySpeedDescending() {
        return this.allBattlers.filter(battler => battler.switchedIn).toSorted((a, b) => b.getEffectiveStats().speed - a.getEffectiveStats().speed);
    }
}
export default Battle;
