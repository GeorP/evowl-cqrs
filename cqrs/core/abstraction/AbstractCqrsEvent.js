import {NotImplementedError} from '../errors/NotImplementedError';

/**
 * Abstract class that describes interface of CqrsEvent
 * @interface AbstractCqrsEvent
 */
export class AbstractCqrsEvent {

    /**
     * Event name
     * @returns {string}
     */
    static get eventName () {
        throw new NotImplementedError('eventName', 'AbstractCqrsEvent');
    }

    /**
     * Restore event from object
     * @param {{eventName:string,data:Object}} data
     */
    static restore (data) {
        throw new NotImplementedError('restore', 'AbstractCqrsEvent');
    }

    /**
     *
     * @param {string} eventName
     */
    constructor (eventName) {
        this._eventName = eventName;
    }

    /**
     *
     * @returns {string}
     */
    get eventName () {
        return this._eventName;
    }

    /**
     * Serialize event data to object
     * @returns {Object}
     */
    dataToObject () {
        throw new NotImplementedError('dataToObject', 'AbstractCqrsEvent');
    }

    /**
     * Serialize event to object
     * @returns {{eventName:string,data:Object}}
     */
    toObject () {
        return {
            eventName: this.eventName,
            data: this.dataToObject()
        }
    }

    /**
     * Serialize event to json object
     * @returns {string}
     */
    toString () {
        return JSON.stringify(this.toObject());
    }
}