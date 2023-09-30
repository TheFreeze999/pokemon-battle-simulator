class Team {
    battle;
    battlers = [];
    constructor(battle) {
        this.battle = battle;
    }
    get index() {
        return this.battle.teams.indexOf(this);
    }
    get enemyTeam() {
        return this.battle.teams[this.index === 0 ? 1 : 0];
    }
    addBattler(battler) {
        this.battlers.push(battler);
        battler.team = this;
    }
}
export default Team;