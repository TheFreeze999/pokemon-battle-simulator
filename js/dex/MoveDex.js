import Move from "../Move.js";
import Type from "../Type.js";
import DamageAction from "../queue/actions/DamageAction.js";
import StatStageChangeAction from "../queue/actions/StatStageChangeAction.js";
var MoveDex;
(function (MoveDex) {
    MoveDex.accelerock = new Move({
        name: "accelerock",
        displayName: "Accelerock",
        type: Type.ROCK,
        category: Move.Category.PHYSICAL,
        basePower: 40,
        accuracy: 100,
        contact: true,
        priority: 1,
        pp: 20,
    });
    MoveDex.energy_ball = new Move({
        name: "energy_ball",
        displayName: "Energy Ball",
        type: Type.GRASS,
        category: Move.Category.SPECIAL,
        basePower: 90,
        accuracy: 100,
        pp: 10,
        async applySecondaryEffects(moveAction) {
            const target = moveAction.targets[0];
            if (!moveAction.isSuccessfulOn(target))
                return;
            const statDropAction = new StatStageChangeAction(target, "specialDefense", -1);
            statDropAction.priority = 30;
            statDropAction.chance = [100, 100];
            statDropAction.cause = moveAction;
            moveAction.queue?.push(statDropAction);
        },
    });
    MoveDex.flamethrower = new Move({
        name: "flamethrower",
        displayName: "Flamethrower",
        type: Type.FIRE,
        category: Move.Category.SPECIAL,
        basePower: 90,
        accuracy: 100,
        pp: 15,
    });
    MoveDex.shell_smash = new Move({
        name: "shell_smash",
        displayName: "Shell Smash",
        type: Type.NORMAL,
        category: Move.Category.STATUS,
        accuracy: -1,
        targeting: Move.Targeting.SELF,
        pp: 15,
        async applySecondaryEffects(moveAction) {
            const defensiveStats = ['defense', 'specialDefense'];
            const offensiveStats = ['attack', 'specialAttack', 'speed'];
            for (const defensiveStat of defensiveStats) {
                const statDropAction = new StatStageChangeAction(moveAction.user, defensiveStat, -1);
                statDropAction.cause = moveAction;
                statDropAction.priority = 30;
                moveAction.queue?.push(statDropAction);
            }
            for (const offensiveStat of offensiveStats) {
                const statDropAction = new StatStageChangeAction(moveAction.user, offensiveStat, 2);
                statDropAction.cause = moveAction;
                statDropAction.priority = 30;
                moveAction.queue?.push(statDropAction);
            }
        },
    });
    MoveDex.struggle = new Move({
        name: "struggle",
        displayName: "Struggle",
        type: Type.NORMAL,
        category: Move.Category.PHYSICAL,
        basePower: 50,
        accuracy: -1,
        contact: true,
        priority: 1,
        pp: -1,
        ignoreTypeEffectiveness: true,
        async applySecondaryEffects(moveAction) {
            const recoilAmount = Math.round(moveAction.user.initialStats.hp / 4);
            const recoilAction = new DamageAction(moveAction.user, recoilAmount);
            recoilAction.cause = moveAction;
            recoilAction.priority = 40;
            recoilAction.showText = false;
            recoilAction.showHpRemainingText = false;
            recoilAction.eventHandler.addEventListener('before execution', async () => {
                await moveAction.queue?.battle.renderer.showTextWhilePausingQueue(`${moveAction.user.displayName} lost some HP due to recoil.`);
            });
            moveAction.queue?.push(recoilAction);
        },
    });
    MoveDex.surf = new Move({
        name: "surf",
        displayName: "Surf",
        type: Type.WATER,
        category: Move.Category.SPECIAL,
        basePower: 90,
        accuracy: 100,
        pp: 15,
    });
    MoveDex.thunderbolt = new Move({
        name: "thunderbolt",
        displayName: "Thunderbolt",
        type: Type.ELECTRIC,
        category: Move.Category.SPECIAL,
        basePower: 90,
        accuracy: 100,
        pp: 15,
    });
})(MoveDex || (MoveDex = {}));
export default MoveDex;
