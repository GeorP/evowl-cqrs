import {AbstractAggregateRepository} from './abstraction/AbstractAggregateRepository';

/**
 * @implements {AbstractAggregateRepository}
 */
export class AggregateRepository extends AbstractAggregateRepository {

    /**
     * Type of entity
     * @returns {string}
     */
    static get entityType () {
        return 'AggregateRepository';
    }

    /**
     * Meta information about entity
     * @returns {{type: string, name: *, version: string}}
     */
    static get meta () {
        return {
            type: AggregateRepository.entityType,
            name: AggregateRepository.name,
            version: '1.0'
        }
    }

    /**
     * @param {Logger} logger
     * @param {AbstractEventStoreAdapter} eventStoreAdapter
     */
    constructor (logger, eventStoreAdapter) {
        super(eventStoreAdapter);
        this._logger = logger.getInterface(AggregateRepository.entityType);
        this._logger.info('AggregateRepository instantiated', AggregateRepository.meta);
    }

    /**
     * Generate stream id based on aggregate constructor and aggregate uuid
     * @param {string} aggregateName
     * @param {uuid} uuid
     * @private
     */
    _getStreamID (aggregateName, uuid) {
        return [aggregateName, uuid].join('-');
    }

    /**
     * Asynchronously loads aggregate from EventStore
     *
     * @param {AbstractAggregate} aggregateCtor  Aggregate constructor
     * @param {string} uuid Unique identifier of the needed aggregate
     * @returns {Promise<AbstractAggregate>}
     */
    getByID (aggregateCtor, uuid) {
        this._logger.info('Loading aggregate', {aggregateName: aggregateCtor.aggregateName, uuid: uuid});
        const aggregateGen = this._es.read(this._getStreamID(aggregateCtor.aggregateName, uuid));
        const version = aggregateGen.next().value;
        const aggregate = aggregateCtor.create(uuid, version);
        for (let event of aggregateGen) {
            aggregate.applyEvent(event);
        }
        return Promise.resolve(aggregate);
    }

    /**
     * Asynchronously saves all changes to EventStore
     * @param {AbstractAggregate} aggregate  Concrete aggregate instance to be saved
     * @returns {Promise<empty|Error>}
     */
    save (aggregate) {
        const aggregateName = aggregate.constructor.aggregateName;
        this._logger.info('Saving aggregates uncommitted changes', aggregate);

        return this._es.write( //saving data to event store
            this._getStreamID(aggregateName, aggregate.uuid),
            aggregate.uncommittedEvents,
            aggregate.originVersion
        ).then(
            newVersion => { // all changes saved, we get new aggregate version
                this._logger.debug('Aggregates uncommitted changes saved', {
                    name: aggregate.aggregateName,
                    uuid: aggregate.uuid,
                    newVersion: newVersion
                });
                //TODO: Should we move it to EventStore Adapter?
                aggregate.clearUncommittedEvents();
                return newVersion;
            },
            error => { // error during saving
                this._logger.error('Saving aggregates uncommitted changes failed',
                    {
                        aggregate: {
                            name: aggregate.aggregateName,
                            uuid: aggregate.uuid,
                            version: aggregate.version,
                            uncommittedEvents: aggregate.uncommittedEvents
                        },
                        error: this._logger.serializeError(error)
                    }
                );
                throw error;
            }
        );
    }
}