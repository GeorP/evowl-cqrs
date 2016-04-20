import {RPCOperationReceiver, RPCOperationSender} from './rabbit-mq/';
import {AbstractCommandBus} from './abstraction/AbstractCommandBus';
import {CommandExecutionResult} from './CommandExecutionResult';


/**
 * Command bus implementation based on RabbitMQ
 */
export class  CommandBusRabbitMQRPC extends AbstractCommandBus {

    /**
     * Get meta information
     * @returns {string}
     */
    static get meta () {
        return {
            type: 'CommandBus',
            name: CommandBusRabbitMQRPC.name,
            version: '0.1'
        }
    }

    /**
     * @param {Logger} logger
     * @param {RabbitMQConnector} connector
     * @param {string} exchangeName
     * @param {CommandFactory} commandFactory
     */
    constructor (logger, connector, exchangeName, commandFactory) {
        super();
        this._logger = logger.getInterface('CommandBus');
        this._receiver = new RPCOperationReceiver(connector, exchangeName);
        this._sender = new RPCOperationSender(connector, exchangeName);
        this._commandFactory = commandFactory;
        this._logger.info('CommandBus instantiated', CommandBusRabbitMQRPC.meta);
    }

    /**
     * Promise that will be resolved when CommandBus ready to use
     * @type {Promise}
     */
    get ready () {
        return Promise.all([
            this._receiver.ready,
            this._sender.ready
        ]).then(
            () => this._logger.info("CommandBus ready")
        );
    }

    /**
     * Execute command, return promise that will be resolved with execution result.
     * @param {AbstractCqrsCommand} command
     * @returns {Promise.<AbstractCommandExecutionResult>}
     */
    execute (command) {
        this._logger.info("Execute command", command.toObject());
        return this._sender.execute(command.cmd, command.toString()).then(
            result => {
                this._logger.info("Command result received", result);
                return CommandExecutionResult.restore(command, result)
            },
            error => {
                this._logger.error("Error during command execution", error);
                return Promise.reject(new CommandExecutionResult(command, null, error))
            }
        );
    }

    /**
     * Register command handler in command bus, so command bus will be able to route command
     * @param {AbstractCommandHandler} commandHandler
     */
    registerCommandHandler (commandHandler) {
        this._logger.info("Register command handler", commandHandler.meta);
        this._receiver.registerHandler(commandHandler.pattern, msg => {
            this._logger.info("Command received", msg);
            const cmd = this._commandFactory.restore(msg);
            return commandHandler.execute(cmd).then(
                result => {
                    this._logger.info("Command executed", result);
                    return result.toString(); // This result will be processed by RTCOperationReceiver and sent back
                    // to command originator. RTCOperationReceiver is lower level class, that expected to see string
                },
                error => {
                    this._logger.info("Error during command execution", error);
                    return new CommandExecutionResult(cmd, null, error).toString();
                }
            )
        });
    }
}