import {NotImplementedError} from '../errors/NotImplementedError';

/**
 * Abstract class that describes interface of EventStoreAdapter
 * @interface <AbstractEventStoreAdapter>
 */
export class AbstractEventStoreAdapter {

    /**
     * Read all events from specific stream
     * @param {string} streamId
     */
    read (streamId) {
        throw new NotImplementedError('read', 'AbstractEventStoreAdapter')
    }

    /**
     * Write events to specifiv stream
     * @param {string} streamID
     * @param {Array.<AbstractCqrsEvent>} events
     * @param {number} expectedVersion
     * @returns Promise.<number|Error> Promise will be resolved with new stream version or with error
     */
    write (streamID, events, expectedVersion) {
        throw new NotImplementedError('write', 'AbstractEventStoreAdapter')
    }
}