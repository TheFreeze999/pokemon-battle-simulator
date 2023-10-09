import Events from "./Events.js";
import Renderer from "./Renderer.js";
import Team from "./Team.js";
import Turn from "./Turn.js";
import BattleQueue from "./queue/BattleQueue.js";
class Battle {
    teams = [
        new Team(this),
        new Team(this)
    ];
    queue = new BattleQueue(this);
    turn = new Turn(this, 1);
    eventHandler = new Events.Handler();
    renderer = new Renderer(this, document.querySelector('.container'));
    winner = null;
    get ended() { return this.winner !== null; }
    constructor() {
        this.eventHandler.dispatchEvent('new turn');
        this.teams[1].isOpposing = true;
    }
    get allBattlers() {
        return this.teams.flatMap(team => team.battlers);
    }
    start() {
        this.renderer.setSpritesToSwitchedInBattlers();
        this.renderer.updateTurnEl();
        this.teams.find(team => team.isOpposing)?.battlers.forEach(battler => battler.displayName = `The opposing ${battler.displayName}`);
    }
    get allSwitchedIn() {
        return this.allBattlers.filter(battler => battler.switchedIn);
    }
}
export default Battle;
