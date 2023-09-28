import Team from "./Team.js";
import BattleQueue from "./queue/BattleQueue.js";

class Battle {
	teams: [Team, Team] = [
		new Team(this),
		new Team(this)
	];
	queue = new BattleQueue(this);
}

export default Battle;