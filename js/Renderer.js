import { delay } from "./util.js";
class Renderer {
    battle;
    container;
    textboxElement;
    constructor(battle, container) {
        this.battle = battle;
        this.container = container;
        console.log(this.container);
        this.textboxElement = this.container.querySelector('.textbox');
        console.log(this.textboxElement.getBoundingClientRect());
    }
    async showText(text, classes, delayAfter) {
        const pEl = document.createElement('p');
        pEl.classList.add('text');
        classes.forEach(className => pEl.classList.add(className));
        pEl.innerHTML = "&#8203";
        this.textboxElement.appendChild(pEl);
        const toScrollEl = this.container.querySelector('.autoscroll');
        if (toScrollEl.checked)
            this.textboxElement.scrollTo(0, this.textboxElement.scrollHeight);
        const chars = text.split("");
        for (const char of chars) {
            pEl.innerHTML += char;
            await delay(5);
        }
        await delay(delayAfter);
    }
    async showTextWhilePausingQueue(text, classes = [], delayAfter = 200) {
        this.battle.queue.pause();
        await this.showText(text, classes, delayAfter);
        this.battle.queue.resume();
    }
}
export default Renderer;
