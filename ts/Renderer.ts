import Battle from "./Battle.js";
import { delay } from "./util.js";

class Renderer {
	private textboxElement: HTMLDivElement;

	constructor(public battle: Battle, public container: HTMLDivElement) {
		console.log(this.container);
		this.textboxElement = this.container.querySelector('.textbox') as HTMLDivElement;

		console.log(this.textboxElement.getBoundingClientRect());
	}

	private async showText(text: string, classes: string[], delayAfter: number) {
		const pEl = document.createElement('p');
		pEl.classList.add('text');
		classes.forEach(className => pEl.classList.add(className));
		pEl.innerHTML = "&#8203";
		this.textboxElement.appendChild(pEl);
		const toScrollEl = this.container.querySelector('.autoscroll') as HTMLInputElement;
		if (toScrollEl.checked)
			this.textboxElement.scrollTo(0, this.textboxElement.scrollHeight);

		const chars = text.split("");

		for (const char of chars) {
			pEl.innerHTML += char;
			await delay(5);
		}
		await delay(delayAfter);
	}

	async showTextWhilePausingQueue(text: string, classes: string[] = [], delayAfter = 200) {
		this.battle.queue.pause();
		await this.showText(text, classes, delayAfter);
		this.battle.queue.resume();
	}
}

export default Renderer;