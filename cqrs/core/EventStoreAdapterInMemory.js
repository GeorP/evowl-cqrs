import {AbstractEventStoreAdapter} from './abstraction/AbstractEventStoreAdapter';

/**
 * @implements {AbstractEventStoreAdapter}
 */
export class EventStoreAdapterInMemory  extends AbstractEventStoreAdapter {

    /**
     * Type of entity
     * @returns {string}
     */
    static get entityType () {
        return 'EventStore';
    }

    /**
     * Meta information about entity
     * @returns {{type: string, name: *, version: string}}
     */
    static get meta () {
        return {
            type: EventStoreAdapterInMemory.entityType,
            name: EventStoreAdapterInMemory.name,
            version: '1.0'
        }
    }

    /**
     *
     * @param {Logger} logger
     * @param {EventFactory} eventFactory
     * @param {AbstractEventBus} eventBus
     */
    constructor (logger, eventFactory, eventBus) {
        super();
        this._logger = logger.getInterface();
        this._ef = eventFactory;
        this._eb = eventBus;
        this._store = {};
        this._logger.info('EventStoreAdapter instantiated', EventStoreAdapterInMemory.meta);
    }

    /**
     * Creates new stream
     * @private
     * @param {string} streamID
     */
    _createStream (streamID) {
        if (this._isStreamExists(streamID)) {
            throw new Error('Stream already existed');
        }
        this._store[streamID] = {
            version: 0,
            created: new Date(),
            events: []
        };
    }

    /**
     * Get stream version
     * @private
     * @param {string} streamID
     * @returns {number}
     */
    _getStreamVersion (streamID) {
        return this._store[streamID].version;
    }

    /**
     * Checks if stream exists in store
     * @private
     * @param {string} streamID
     * @returns {boolean}
     */
    _isStreamExists (streamID) {
        return this._store[streamID] ? true : false;
    }

    /**
     * Checks if stream version equal expected
     * @private
     * @param {string} streamID
     * @param {number} version
     * @returns {boolean}
     */
    _isStreamVersionEqual (streamID, version) {
        return this._getStreamVersion(streamID) === version;
    }

    /**
     * Push event to the certain stream
     * @param {string} streamID
     * @param {Object} eventData
     * @private
     */
    _pushEvent (streamID, eventData) {
        const stream = this._store[streamID];
        stream.events.push(eventData);
        stream.version++;
    }


    /**
     * Read all events from specific stream
     * @param {string} streamID
     */
    * read (streamID) {
        this._logger.info('Reading stream', {streamID});
        yield this._store[streamID].version;
        const events = this._store[streamID].events;
        let i = 0;
        for (; i < events.length - 1; i++) {
            yield this._ef.restore(events[i]);
        }
        return events[++i];
    }

    /**
     * Write events to specific stream
     * @param {string} streamID
     * @param {Array.<AbstractCqrsEvent>} events
     * @param {number} expectedVersion
     * @returns Promise.<number|Error> Promise will be resolved with new stream version or with error
     */
    write (streamID, events, expectedVersion) {
        this._logger.info('Writing changes', {streamID, events, expectedVersion});

        if (!this._isStreamExists(streamID)) {
            this._createStream(streamID);
        }
        if (!this._isStreamVersionEqual(streamID, expectedVersion)) {
            return Promise.reject(new Error(`Expected version doesn't match stream state`));
        }
        events.forEach(event => this._pushEvent(streamID, event));
        events.forEach(event => this._eb.publish(event));
        return Promise.resolve(this._getStreamVersion(streamID));
    }
}