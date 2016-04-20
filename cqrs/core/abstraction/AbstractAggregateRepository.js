import {NotImplementedError} from '../errors/NotImplementedError';

/**
 * Abstract class to define interface of Aggregate Repository
 * @interface <AbstractAggregateRepository>
 */
export class AbstractAggregateRepository {

    /**
     *
     * @param {AbstractEventStoreAdapter} eventStoreAdapter
     */
    constructor (eventStoreAdapter) {
        this._es = eventStoreAdapter;

    }

    /**
     * Asynchronously loads aggregate from EventStore
     *
     * @param {AbstractAggregate} aggregateCtor  constructor
     * @param {string} uuid Unique identifier of the needed aggregate
     * @returns {Promise<AbstractAggregate>}
     */
    getByID (aggregateCtor, uuid) {
        throw new NotImplementedError('getByID', 'AggregateRepository');
    }

    /**
     * Asynchronously saves all changes to EventStore
     * @param {AbstractAggregate} aggregate  Concrete aggregate instance to be saved
     * @returns {Promise<empty|Error>}
     */
    save (aggregate) {
        
    }
}