import Battle from "./Battle.js";
import Battler from './Battler.js';

class Team {
	battlers: Battler[] = []

	constructor(public battle: Battle) {

	}

	get index() {
		return this.battle.teams.indexOf(this);
	}

	get enemyTeam() {
		return this.battle.teams[this.index === 0 ? 1 : 0];
	}

	addBattler(battler: Battler) {
		this.battlers.push(battler);
		battler.team = this;
	}
}

export default Team;