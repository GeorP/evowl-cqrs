import {AbstractCqrsEvent}  from '../../../core/abstraction/AbstractCqrsEvent';

/**
 * Foo Pinged event class
 */
export class FooPingedEvent extends AbstractCqrsEvent {

    /**
     * Event name
     * @returns {string}
     */
    static get eventName () {
        return 'foo_pinged';
    }

    /**
     * Restore event from object
     * @param {{eventName:string,data:{aggregateID: uuid, requestID: uuid, byWho: string}}} eventData
     */
    static restore (eventData) {
        if (eventData.eventName !== FooPingedEvent.eventName) {
            throw new Error(`Expected object of event ${FooPingedEvent.eventName}, passed ${eventData.eventName}`);
        }
        const {aggregateID, requestID, byWho} = eventData.data;
        return new FooPingedEvent(aggregateID, requestID, byWho);
    }

    /**
     *
     * @param {uuid} aggregateID
     * @param {uuid} requestID
     * @param {string} byWho
     */
    constructor (aggregateID, requestID, byWho) {
        super(FooPingedEvent.eventName);
        this._aggregateID = aggregateID;
        this._requestID = requestID;
        this._byWho = byWho;
    }

    /**
     *
     * @returns {uuid}
     */
    get aggregateID () {
        return this._aggregateID;
    }

    /**
     *
     * @returns {uuid}
     */
    get requestID () {
        return this._requestID;
    }

    /**
     *
     * @returns {string}
     */
    get byWho () {
        return this._byWho;
    }

    /**
     * Serialize event data to object
     * @returns {{aggregateID: uuid, requestID: uuid, byWho: string}}
     */
    dataToObject () {
        return {
            aggregateID: this.aggregateID,
            requestID: this.requestID,
            byWho: this.byWho
        }
    }

    /**
     * TODO: remove this, because this method implemented in AbstractCqrsEvent
     * @returns {{aggregateID: uuid, requestID: uuid, byWho: string}}
     */
    toJSON () {
        return {
            aggregateID: this.aggregateID,
            requestID: this.requestID,
            byWho: this.byWho
        }
    }
}