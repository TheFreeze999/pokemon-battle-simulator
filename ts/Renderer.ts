import Battle from "./Battle.js";
import Battler from "./Battler.js";
import { delay, mapNumberInRange } from "./util.js";

class Renderer {
	private textboxEl: HTMLDivElement;
	private sceneEl: HTMLDivElement;
	private battlerEls: HTMLDivElement[];
	private turnEl: HTMLParagraphElement;

	constructor(public battle: Battle, public container: HTMLDivElement) {
		this.textboxEl = this.container.querySelector('.textbox') as HTMLDivElement;
		this.sceneEl = this.container.querySelector('.scene') as HTMLDivElement;
		this.battlerEls = Array.from(this.sceneEl.querySelectorAll('.battler')) as HTMLDivElement[];
		this.turnEl = this.sceneEl.querySelector('.turn') as HTMLParagraphElement;
	}

	private async showText(text: string, classes: string[], delayAfter: number) {
		const pEl = document.createElement('p');
		pEl.classList.add('text');
		classes.forEach(className => pEl.classList.add(className));
		pEl.innerHTML = "&#8203";
		this.textboxEl.appendChild(pEl);
		const toScrollEl = this.container.querySelector('.autoscroll') as HTMLInputElement;
		if (toScrollEl.checked)
			this.textboxEl.scrollTo(0, this.textboxEl.scrollHeight);

		const chars = text.split("");

		for (const char of chars) {
			pEl.innerHTML += char;
			await delay(5);
		}
		await delay(delayAfter);
	}

	async showTextWhilePausingQueue(text: string, classes: string[] = [], delayAfter = 200) {
		if (this.battle.queue.paused) await this.battle.queue.eventHandler.awaitDispatch('resume');
		this.battle.queue.pause();
		await this.showText(text, classes, delayAfter);
		this.battle.queue.resume();
	}

	setSpritesToSwitchedInBattlers() {
		this.battle.teams.forEach((team) => {
			const switchedInBattler = team.switchedInBattler;
			const battlerEl = this.getBattlerElFromBattler(switchedInBattler);
			const spriteEl = battlerEl.querySelector('.sprite') as HTMLImageElement;
			spriteEl.src = `http://play.pokemonshowdown.com/sprites/ani/${switchedInBattler.creature.species.name}.gif`;
		})
	}

	private getBattlerElFromBattler(battler: Battler) {
		const battlerNumberInUI = battler.team?.index === 0 ? 0 : 1;
		return this.battlerEls[battlerNumberInUI]
	}

	private async animateHpBarTo(currentPercentage: number, hpValueEl: HTMLDivElement) {
		const hue = mapNumberInRange(currentPercentage, [0, 100], [0, 120])
		hpValueEl.style.setProperty('--percent', currentPercentage.toString());
		hpValueEl.style.setProperty('--hue', hue.toString());
		await delay(5)
	}

	async setHPPercentageTo(battler: Battler, oldPercentage: number, newPercentage: number) {
		const isHpChangePositive = newPercentage > oldPercentage;
		const color = isHpChangePositive ? '#00ffff55' : '#ffff0055';
		const battlerEl = this.getBattlerElFromBattler(battler);
		battlerEl.animate([
			{ backgroundColor: 'transparent' },
			{ backgroundColor: color },
			{ backgroundColor: 'transparent' },
		], 200);
		await delay(200);
		const hpValueEl = battlerEl.querySelector('.hp .value') as HTMLDivElement;

		if (isHpChangePositive) {
			for (let currentPercentage = oldPercentage; currentPercentage <= newPercentage; currentPercentage++) {
				await this.animateHpBarTo(currentPercentage, hpValueEl);
			}
		} else {
			for (let currentPercentage = oldPercentage; currentPercentage >= newPercentage; currentPercentage--) {
				await this.animateHpBarTo(currentPercentage, hpValueEl);
			}
		}
	}
	async shakeBattler(battler: Battler) {
		const battlerEl = this.getBattlerElFromBattler(battler);
		const spriteEl = battlerEl.querySelector('.sprite') as HTMLImageElement;
		const rotationDegree = spriteEl.classList.contains('flipped') ? "30deg" : "-30deg"
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
	async showFaintAnimation(battler: Battler) {
		const battlerEl = this.getBattlerElFromBattler(battler);
		const spriteEl = battlerEl.querySelector('.sprite') as HTMLImageElement;
		const duration = 1000;
		spriteEl.animate([
			{ opacity: "1" },
			{ opacity: "0" },
		], {
			duration: duration / 2,
			fill: 'forwards'
		});
		spriteEl.animate([
			{ translate: "0 0" },
			{ translate: "0 1000px" },
		], {
			duration,
		});
		await delay(duration);
	}

	async showStatStageChange(battler: Battler, amount: number) {
		const battlerEl = this.getBattlerElFromBattler(battler);
		const statChangeEl = battlerEl.querySelector('.stat-change') as HTMLDivElement;
		const arrowEls = Array.from(statChangeEl.querySelectorAll('.arrow')) as HTMLDivElement[];
		const isPositive = amount > 0;
		const arrowsToRender = Math.abs(amount);
		const duration = 750;

		console.log(arrowEls, arrowsToRender)

		for (let i = 0; i < arrowEls.length; i++) {
			const arrowEl = arrowEls[i];
			if (i < arrowsToRender) arrowEl.classList.remove('hidden');
			else arrowEl.classList.add('hidden');
		}

		if (isPositive) {
			statChangeEl.classList.add('positive');
			statChangeEl.classList.remove('negative');
		} else {
			statChangeEl.classList.add('negative');
			statChangeEl.classList.remove('positive');
		}

		statChangeEl.animate([
			{ opacity: "0" },
			{ opacity: "1" },
			{ opacity: "0" },
		], duration);
		await delay(duration);
	}

	updateTurnEl() {
		this.turnEl.innerHTML = `Turn ${this.battle.turn.number}`;
	}
}

export default Renderer;