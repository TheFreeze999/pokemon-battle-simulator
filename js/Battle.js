import Team from "./Team.js";
import BattleQueue from "./queue/BattleQueue.js";
class Battle {
    teams = [
        new Team(this),
        new Team(this)
    ];
    queue = new BattleQueue(this);
}
export default Battle;
