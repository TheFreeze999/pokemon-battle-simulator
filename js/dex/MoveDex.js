import Move from "../Move.js";
import Type from "../Type.js";
import DamageAction from "../queue/actions/DamageAction.js";
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
        applySecondaryEffects(moveAction) {
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
})(MoveDex || (MoveDex = {}));
export default MoveDex;
