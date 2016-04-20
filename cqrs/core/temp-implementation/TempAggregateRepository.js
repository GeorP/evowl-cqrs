import {AbstractAggregateRepository} from '../abstraction/AbstractAggregateRepository';

/**
 * Temporary implementation of AggregateRepository in order to show simple example
 */
export class TempAggregateRepository extends AbstractAggregateRepository {
    /**
     * Asynchronously loads aggregate from EventStore
     *
     * @param {AbstractAggregate} aggregate  constructor
     * @param {string} uuid Unique identifier of the needed aggregate
     * @returns {Promise<AbstractAggregate>}
     */
    getByID (aggregate, uuid) {
        return new Promise((resolve, reject) => {
            var agr = new aggregate(uuid);
            this._es.readAllEvents(uuid).then(
                (// on read success
                    eventList => {
                        eventList.forEach(event => agr.applyEvent(event));
                        resolve(agr);
                    }
                ),
                (// error during read operation
                    error => {
                        console.log('Error during read operation', error)
                        console.log(error.stack);
                    }
                )
            ).catch( // error during apply event to aggregate
                error => {
                    console.log('Error during apply event to aggregate', error);
                    console.log(error.stack);
                }
            );
        });
    }

    /**
     * Asynchronously saves all changes to EventStore
     * @param {AbstractAggregate} aggregate  Concrete aggregate instance to be saved
     * @returns {Promise<empty|Error>}
     */
    save (aggregate) {
        
        return this._es.writeEvents(aggregate.uuid, aggregate.version, aggregate.uncommittedEvents);
    }
}