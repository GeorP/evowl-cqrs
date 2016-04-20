import {AbstractEventBus} from './abstraction/AbstractEventBus';
import {AbstractCqrsEvent} from './abstraction/AbstractCqrsEvent';
import {TypeMismatchError} from './errors/TypeMismatchError';
import {MessageSender} from './rabbit-mq/MessageSender';
import {MessageReceiver} from './rabbit-mq/MessageReceiver';

/**
 * Message Bus implementation based on Rabbit MQ
 * @implements {AbstractEventBus}
 */
export class EventBusRabbitMQ extends AbstractEventBus {

    /**
     * Get meta information
     * @returns {string}
     */
    static get meta () {
        return {
            type: 'EventBus',
            name: EventBusRabbitMQ.name,
            version: '0.1'
        }
    }

    /**
     * @param {Logger} logger
     * @param {RabbitMQConnector} connector
     * @param {string} exchangeName
     */
    constructor (logger, connector, exchangeName) {
        super();
        this._logger = logger.getInterface('EventBus');
        this._connector = connector;
        this._exchangeName = exchangeName;
        this._sender = new MessageSender(connector, exchangeName);
        this._receivers = [];
        this._logger.info('EventBus instantiated', EventBusRabbitMQ.meta);
    }

    /**
     * Push new event to bus
     * @param {AbstractCqrsEvent} event
     */
    publish (event) {
        if (!(event instanceof AbstractCqrsEvent)) {
            throw new TypeMismatchError('AbstractCqrsEvent', event);
        }
        this._logger.info('Publishing event', event);
        this._sender.publish(event.eventName, event.toString());
    }

    /**
     * Register denormalizer event handlers
     * @param {EventHandlersBucket} denormalizerHandlers
     */
    registerEventHandlers (denormalizerHandlers) {
        this._logger.info('Registering event handlers bucket', denormalizerHandlers);
        this._receivers.push(
            new MessageReceiver(this._connector, this._exchangeName, denormalizerHandlers)
        );
    }
}