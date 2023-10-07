import { delay, mapNumberInRange } from "./util.js";
class Renderer {
    battle;
    container;
    textboxEl;
    sceneEl;
    battlerEls;
    constructor(battle, container) {
        this.battle = battle;
        this.container = container;
        this.textboxEl = this.container.querySelector('.textbox');
        this.sceneEl = this.container.querySelector('.scene');
        this.battlerEls = Array.from(this.sceneEl.querySelectorAll('.battler'));
    }
    async showText(text, classes, delayAfter) {
        const pEl = document.createElement('p');
        pEl.classList.add('text');
        classes.forEach(className => pEl.classList.add(className));
        pEl.innerHTML = "&#8203";
        this.textboxEl.appendChild(pEl);
        const toScrollEl = this.container.querySelector('.autoscroll');
        if (toScrollEl.checked)
            this.textboxEl.scrollTo(0, this.textboxEl.scrollHeight);
        const chars = text.split("");
        for (const char of chars) {
            pEl.innerHTML += char;
            await delay(5);
        }
        await delay(delayAfter);
    }
    async showTextWhilePausingQueue(text, classes = [], delayAfter = 200) {
        if (this.battle.queue.paused)
            await this.battle.queue.eventHandler.awaitDispatch('resume');
        this.battle.queue.pause();
        await this.showText(text, classes, delayAfter);
        this.battle.queue.resume();
    }
    setSpritesToSwitchedInBattlers() {
        this.battle.teams.forEach((team) => {
            const switchedInBattler = team.battlers.find((battler) => battler.switchedIn);
            if (!switchedInBattler)
                return;
            const battlerEl = this.getBattlerElFromBattler(switchedInBattler);
            const spriteEl = battlerEl.querySelector('.sprite');
            spriteEl.src = `https://play.pokemonshowdown.com/sprites/gen6/${switchedInBattler.creature.species.name}.png`;
        });
    }
    getBattlerElFromBattler(battler) {
        const battlerNumberInUI = battler.team?.index === 0 ? 0 : 1;
        return this.battlerEls[battlerNumberInUI];
    }
    async setHPPercentageTo(battler, oldPercentage, newPercentage) {
        const battlerEl = this.getBattlerElFromBattler(battler);
        battlerEl.animate([
            { backgroundColor: 'transparent' },
            { backgroundColor: '#ffff0055' },
            { backgroundColor: 'transparent' },
        ], 200);
        await delay(200);
        const hpValueEl = battlerEl.querySelector('.hp .value');
        if (oldPercentage > newPercentage) {
            for (let currentPercentage = oldPercentage; currentPercentage >= newPercentage; currentPercentage--) {
                const hue = mapNumberInRange(currentPercentage, [0, 100], [0, 120]);
                hpValueEl.style.setProperty('--percent', currentPercentage.toString());
                hpValueEl.style.setProperty('--hue', hue.toString());
                await delay(5);
            }
        }
    }
    async shakeBattler(battler) {
        const battlerEl = this.getBattlerElFromBattler(battler);
        const spriteEl = battlerEl.querySelector('.sprite');
        const rotationDegree = spriteEl.classList.contains('flipped') ? "30deg" : "-30deg";
        spriteEl.animate([
            { rotate: "0deg" },
            { rotate: rotationDegree },
            { rotate: "0deg" },
        ], 500);
        spriteEl.animate([
            { translate: "0 -20px" },
            { translate: "0 0" },
            { translate: "0 -20px" },
            { translate: "0 0" },
        ], 500);
        await delay(500);
    }
}
export default Renderer;
