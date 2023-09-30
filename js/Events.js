var Events;
(function (Events) {
    class Handler {
        events = [];
        addEventListener(id, callback, priority = 0) {
            const idAlreadyExists = !!this.events.find(event => event.id === id);
            this.events.push({ id, callback, priority });
            return idAlreadyExists;
        }
        dispatchEvent(id, ...args) {
            const events = this.events.filter(event => event.id === id);
            const sorted = events.sort((a, b) => b.priority - a.priority);
            sorted.forEach(events => events.callback(...args));
            return sorted.length;
        }
        removeEventListener(id) {
            const removeCount = this.events.filter(event => event.id === id).length;
            this.events = this.events.filter(event => event.id !== id);
            return removeCount;
        }
    }
    Events.Handler = Handler;
})(Events || (Events = {}));
export default Events;
