import {EventHandlersBucket} from './rabbit-mq/EventHandlersBucket';

export class CqrsEventHandlersBucket {

    constructor (signature) {
        this._bucket = new EventHandlersBucket(signature);
    }

    /**
     *
     * @returns {string}
     */
    get signature () {
        return this._bucket._signature;
    }

    /**
     * Get list of registered patterns
     * @returns {Array.<string>}
     */
    get patterns () {
        return this._bucket.patterns;
    }

    /**
     * Returns general handler for all patterns
     * @returns {Function}
     */
    get handler () {
        return this._bucket.handler;
    }

    /**
     * Add new handler to set
     * @param {AbstractCqrsEvent} eventCtor
     * @param {Function} handler
     */
    addHandler (eventCtor, handler) {
        this._bucket.addHandler(
            eventCtor.eventName,
            eventData => handler(eventCtor.restore(eventData))
        );
    }

}