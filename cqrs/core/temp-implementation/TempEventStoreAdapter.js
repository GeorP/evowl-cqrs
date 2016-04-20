import {AbstractEventStoreAdapter} from '../abstraction/AbstractEventStoreAdapter';

/**
 * Temporary implementation of EventStoreAdapter
 */
export class TempEventStoreAdapter extends AbstractEventStoreAdapter {

    /**
     *
     * @param {TempEventBus} eventBus
     */
    constructor (eventBus) {
        super();
        this._eventBus = eventBus;
        this._store ={};
    }

    /**
     * Read all events related to certain aggregate
     * @param {uuid} uuid
     * @returns {Promise<Array.<AbstractCqrsEvent>>}
     */
    readAllEvents (uuid) {
        if (!this._store[uuid]) {
            return null;
        }

        // I use promise here in order to show that this operation is async
        return Promise.resolve(this._store[uuid].events);
    }

    /**
     * Check if aggregate exists in store
     * @param {uuid} uuid
     * @returns {Promise<boolean>}
     */
    isExists (uuid) {
        return Promise.resolve(this._store[uuid] ? true : false);
    }

    /**
     * Register new (empty) aggregate record in store
     * @param {uuid} uuid
     * @private
     */
    _registerNewAggregate (uuid) {
        this._store[uuid] = {
            uuid: uuid,
            version: 0,
            events: []
        }
    }

    /**
     * Write events for certain aggregate
     * @param uuid
     * @param event
     * @returns {Promise<boolean|error>}
     */
    writeEvents (uuid, originalVersion, eventList) {
        return new Promise ((resolve, reject) => {
            if (!this._store[uuid]) {
                this._registerNewAggregate(uuid);
            }
            const aggregateData = this._store[uuid];
            // TODO: I've commented this, because we've changed a bit logic about Aggregates
            // and it now conflicts with AggregateRepository, so it can't properly set originVersion
            // so I have to disable this verification
            // But it should be implemented in stable AggregateRepository and EventStore
            // if (aggregateData.version !== originalVersion) {
            //     throw new Error("Aggregate's version mismatch");
            // }
            eventList.forEach((event) => {
                aggregateData.events.push(event);
                aggregateData.version++;
                this._eventBus.publish(event);
            });
            resolve(true);
        });
    }
}