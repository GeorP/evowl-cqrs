/**
 * Represent set of handler for events that related to one consumer
 */
export class EventHandlersBucket {

    /**
     *
     * @param {string} signature Consumer's signature
     */
    constructor (signature) {
        this._signature = signature;
        this._handlers = {};
        this._patterns = [];
        this._handler = (pattern, event) => this._executeHandler(pattern, event);
    }

    /**
     *
     * @returns {string}
     */
    get signature () {
        return this._signature;
    }

    /**
     * Get list of registered patterns
     * @returns {Array.<string>}
     */
    get patterns () {
        return this._patterns.slice();
    }

    /**
     * Returns general handler for all patterns
     * @returns {Function}
     */
    get handler () {
        return this._handler;
    }

    /**
     * Execute handler according to pattern
     * @param {string} pattern
     * @param {Object} event
     * @returns {Promise}
     * @private
     */
    _executeHandler (pattern, event) {
        if (!this._handlers[pattern]) {
            throw new Error(`Unknown pattern: ${pattern}`);
        }
        return this._handlers[pattern].call(null, event);
    }

    /**
     * Add new handler to set
     * @param {string} pattern
     * @param {Function} handler
     */
    addHandler (pattern, handler) {
        if (this._handlers[pattern]) {
            throw new Error(`Handler with pattern: ${pattern} already registered`);
        }
        this._patterns.push(pattern);
        this._handlers[pattern] = handler;
    }
}