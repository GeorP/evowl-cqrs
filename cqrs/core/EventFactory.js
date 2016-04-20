/**
 * Factory of events registered in the system
 */
export class EventFactory {

    constructor () {
        this._dict = {};
    }

    /**
     * Register new query class (constructor)
     * @param {AbstractQuery} eventCtor
     */
    register (eventCtor) {
        this._dict[eventCtor.eventName] = eventCtor;
    }

    /**
     * Check if concrete event registered in factory by its name
     * @param {string} name
     * @returns {boolean}
     */
    isEvent (name) {
        return this._dict[name] ? true : false;
    }

    /**
     * Restore event
     * @param {object} data
     * @returns {AbstractQuery}
     */
    restore (data) {
        return this._dict[data.eventName].restore(data);
    }
}