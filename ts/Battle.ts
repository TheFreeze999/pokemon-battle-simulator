import Events from "./Events.js";
import Renderer from "./Renderer.js";
import Team from "./Team.js";
import Turn from "./Turn.js";
import BattleQueue from "./queue/BattleQueue.js";

class Battle {
	teams: [Team, Team] = [
		new Team(this),
		new Team(this)
	];
	queue = new BattleQueue(this);
	turn = new Turn(this, 0);
	eventHandler = new Events.Handler();
	renderer = new Renderer(this, document.querySelector('.container') as HTMLDivElement);
	winner: Team | null = null;
	get ended() { return this.winner !== null }

	constructor() {
		this.eventHandler.dispatchEvent('new turn');
	}

	get allBattlers() {
		return this.teams.flatMap(team => team.battlers);
	}

	start() {
		this.teams.forEach(team => team.battlers[0].switchedIn = true);
		this.renderer.setSpritesToSwitchedInBattlers();
		this.renderer.updateTurnEl();
	}

	sortSwitchedInBattlersBySpeedDescending() {
		return this.allBattlers.filter(battler => battler.switchedIn).toSorted((a, b) => b.getEffectiveStats().speed - a.getEffectiveStats().speed);
	}
}

export default Battle;