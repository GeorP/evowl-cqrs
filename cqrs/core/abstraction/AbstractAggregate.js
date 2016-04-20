import {AbstractCqrsEvent} from './AbstractCqrsEvent';
import {TypeMismatchError} from '../errors/TypeMismatchError';
import {NotImplementedError} from '../errors/NotImplementedError';
import {UnsupportedCqrsEvent} from '../errors/UnsupportedCqrsEvent';

/**
 * Abstract class that describes interface of Aggregate
 * @interface
 */
export class AbstractAggregate {

    static get meta () {
        throw NotImplementedError('meta', AbstractAggregate.name);
    }

    /**
     *
     * @param {string} aggregateName
     * @param {uuid} uuid
     * @param {number} originVersion
     */
    constructor (aggregateName, uuid, originVersion) {
        this._aggregateName = aggregateName;
        this._uuid = uuid;
        this._originVersion = originVersion;
        this._version = originVersion;
        this._uncommittedEvents = [];
    }

    /**
     *
     * @returns {uuid}
     */
    get uuid () {
        return this._uuid;
    }

    /**
     *
     * @returns {number}
     */
    get originVersion () {
        return this._originVersion;
    }

    /**
     *
     * @returns {number}
     */
    get version () {
        return this._version;
    }

    /**
     * @returns {string}
     */
    get aggregateName () {
        return this._aggregateName;
    }

    /**
     * @returns {ArrayAbstractEvents)}
     */
    get uncommittedEvents () {
        //TODO: think if it should be a method, do we need to return copies of events
        return this._uncommittedEvents;
    }

    /**
     * Clear list of uncommitted events
     */
    clearUncommittedEvents () {
        this._uncommittedEvents = [];
    }

    /**
     * Rise new event
     * @param {AbstractCqrsEvent} event
     */
    rise (event) {
        this._uncommittedEvents.push(event);
        try {
            this.applyEvent(event);
        }
        catch (e) {
            switch (true) {
                case (e instanceof UnsupportedCqrsEvent):
                    throw e;
                    break;
                default:
                    throw e;
            }
        }
    }

    /**
     * Apply event to aggregate
     * @param {AbstractCqrsEvent} event
     */
    applyEvent (event) {
        if (!(event instanceof AbstractCqrsEvent)) {
            throw new TypeMismatchError('AbstractCqrsEvent', event);
        }
        const handlerName = 'apply_'+event.eventName;
        if (typeof this[handlerName] !== 'function') {
            throw new UnsupportedCqrsEvent(event.eventName, this.aggregateName);
        }
        this[handlerName].call(this, event);
    }
}