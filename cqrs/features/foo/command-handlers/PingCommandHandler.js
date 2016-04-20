import {AbstractCommandHandler} from '../../../core/abstraction/AbstractCommandHandler'
import {FooAggregate} from '../aggregates/FooAggregate';

import {CommandExecutionResult} from '../../../core/CommandExecutionResult';

/**
 * Command handler of Ping command
 */
export class PingCommandHandler extends AbstractCommandHandler {

    /**
     * @param {Logger} logger
     * @param {AbstractAggregateRepository} aggregateRepository
     */
    constructor (logger, aggregateRepository) {
        super(aggregateRepository, 'foo.ping');
        this._logger = logger.getInterface(PingCommandHandler.name);
    }

    /**
     * Execute command async and return object of execution result
     *
     * @param {AbstractCqrsCommand} command
     * @returns {Promise<AbstractCommandExecutionResult>}
     */
    execute (command) {
        if (!this.match(command)) {
            // TODO: define apropriate error
            throw new Error('Command not supported');
        }
        return this._ping(command).then(
            result => {
                return result;
            },
            error => {
                throw error;
            }
        );
    }


    /**
     * Do ping
     * @param {PingCommand} command
     * @private
     */
    _ping (command) {
        this._logger.info('Processing ping command', command);
        return this._ar.getByID(FooAggregate, command.targetID).then(
            (// success loading
                foo => {
                    this._logger.debug('Foo aggregate loaded', foo);
                    try { //errors can occur during manipulation with aggregate
                        foo.ping(command.requestID, command.byWho);
                    }
                    catch (e) {
                        this._logger.debug('Error during ping', e);
                        // reject promise with TempCommandExecutionResult and error value
                        return new CommandExecutionResult(
                            command, null, e
                        );
                    }
                    this._logger.debug('Foo pinged');
                    return this._ar.save(foo).then(
                        (// return instance of TempCommandExecutionResult with success result
                            result => {
                                this._logger.debug('Foo state saved');
                                return new CommandExecutionResult(
                                    command, result
                                );
                            }
                        ),
                        (// error during save
                            error => {
                                this._logger.debug('Save Foo aggregate changes failed', error);
                                return new CommandExecutionResult(
                                    command, null, error
                                );
                            }
                        )
                    );
                }
            ),
            ( // error during loading aggregate from repository
                error => {
                    this._logger.debug('Foo aggregate load failed');
                    return new CommandExecutionResult(
                        command, null, new error
                    );
                }
            )
        );
    }


}