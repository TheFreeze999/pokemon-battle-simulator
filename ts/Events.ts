namespace Events {
	export class Handler {
		private events: Data[] = [];

		addEventListener(id: ID, callback: ListenerCallback, priority = 0) {
			const idAlreadyExists = !!this.events.find(event => event.id === id);
			this.events.push({ id, callback, priority });
			return idAlreadyExists;
		}

		dispatchEvent(id: ID, ...args: any[]) {
			const events = this.events.filter(event => event.id === id);
			const sorted = events.sort((a, b) => b.priority - a.priority);
			sorted.forEach(events => events.callback(...args));
			return sorted.length;
		}

		removeEventListener(id: ID) {
			const removeCount = this.events.filter(event => event.id === id).length;
			this.events = this.events.filter(event => event.id !== id);
			return removeCount;
		}

		async awaitDispatch(id: ID) {
			return new Promise<void>((resolve, reject) => {
				this.addEventListener(id, () => {
					resolve();
				})
			})
		}
	}
	export interface Data {
		id: ID;
		callback: ListenerCallback;
		priority: number;
	}
	export type ListenerCallback = (...args: any[]) => void;
	export type ID = string | symbol;
}

export default Events;