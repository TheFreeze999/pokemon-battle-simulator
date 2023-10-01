import Battler from "../../../Battler.js";
import Effect from "../../Effect.js";

class BurnEffect extends Effect {
	constructor() {
		super('burn');

		this.eventHandler.addEventListener('application', (battler: Battler) => {
			console.log(`${battler.displayName} was burned.`)
		})
	}
}

export default BurnEffect;