import {AbstractCqrsEvent}  from '../../../core/abstraction/AbstractCqrsEvent';

/**
 * FooPongAnswered event class
 */
export class FooPongAnsweredEvent extends AbstractCqrsEvent {

    /**
     * Event name
     * @returns {string}
     */
    static get eventName () {
        return 'foo_pong_answered';
    }

    /**
     * Restore event from object
     * @param {{eventName:string,data:{dt: timestamp, requestID: uuid, answer: string}}} eventData
     */
    static restore (eventData) {
        if (eventData.eventName !== FooPongAnsweredEvent.eventName) {
            throw new Error(`Expected object of event ${FooPongAnsweredEvent.eventName}, passed ${eventData.eventName}`);
        }
        const {requestID, dt, answer} = eventData.data;
        return new FooPongAnsweredEvent(requestID, dt, answer);
    }

    /**
     *
     * @param {uuid} requestID
     * @param {timestamp} dt
     * @param {string} answer
     */
    constructor (requestID, dt, answer) {
        super(FooPongAnsweredEvent.eventName);
        this._requestID = requestID;
        this._dt = dt;
        this._answer = answer;
    }

    /**
     *
     * @returns {timestamp}
     */
    get dt () {
        return this._dt;
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
    get answer () {
        return this._answer;
    }

    /**
     * Serialize event data to object
     * @returns {{dt: timestamp, requestID: uuid, answer: string}}
     */
    dataToObject () {
        return {
            dt: this.dt,
            requestID: this.requestID,
            answer: this.answer
        }
    }

    /**
     * TODO: remove this, because this method implemented in AbstractCqrsEvent
     * @returns {{dt: timestamp, aggregateID: uuid, requestID: uuid, forWho: string}}
     */
    toJSON () {
        return {
            dt: this.dt,
            requestID: this.requestID,
            answer: this.answer
        }
    }
}