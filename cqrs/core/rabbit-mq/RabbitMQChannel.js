import {RabbitMQExchange} from './RabbitMQExchange';
import {RabbitMQQueue} from './RabbitMQQueue';
import {RabbitMQMessage} from './RabbitMQMessage';

/**
 * Represents entity of Rabbit MQ channel
 */
export class RabbitMQChannel {

    /**
     *
     * @param {string} name
     * @param {object} channel
     */
    constructor (name, channel) {
        this._name = name;
        this._channel = channel;
        this._exchange = null;
        this._queues = [];
    }

    /**
     *
     * @type {string}
     */
    get name () {
        return this._name;
    }

    /**
     *
     * @type {string}
     */
    get exchange () {
        return this._exchange;
    }

    /**
     * Check if channel has exchange
     * @type {boolean}
     */
    get hasExchange () {
        return this._exchange !== null;
    }

    /**
     * Publish event to queue
     * @param {string} pattern
     * @param {string} data
     * @param {Object} options
     * @returns {Promise}
     * @private
     */
    _publish (pattern, data, options) {
        return this._channel.publish(this.exchange.name,
            pattern,
            new Buffer(data),
            options
        );
    }

    /**
     * Add queue to the channel
     * @param {RabbitMQQueue} queue
     * @private
     */
    _registerQueue (queue) {
        this._queues.push(queue);
    }

    /**
     * Assert exchange for channel
     * @param {RabbitMQExchange} exchange
     * @returns {Promise.<RabbitMQChannel>}
     */
    assertExchange (exchange) {
        if (this.hasExchange && this.exchange.isActive) {
            throw new Error(`This channel (${this.name}) already has active exchange`);
        }
        this._exchange = exchange;

        return this._channel.assertExchange(exchange.name, exchange.type, exchange.options).then(
            ok => {
                this.exchange.confirmAssertion();
                return this;
            },
            error => {throw error}
        );
    }

    /**
     * Assert exchange with type=topic
     * @param exchangeName
     * @returns {Promise.<RabbitMQChannel>}
     */
    assertDirectExchange (exchangeName) {
        return this.assertExchange(new RabbitMQExchange(exchangeName, RabbitMQExchange.DIRECT));
    }

    /**
     * Assert queue
     * @param {RabbitMQQueue} queue
     * @returns {Promise.<{channel: RabbitMQChannel, queue:RabbitMQQueue}>}
     */
    assertQueue (queue) {
        return this._channel.assertQueue(queue.name, queue.options).then(
            q => {
                queue.confirmAssertion(q);
                this._registerQueue(queue);
                return {
                    channel: this,
                    queue: queue
                };
            },
            error => { throw error }
        );
    }

    /**
     * Assert queue with parameter exclusive=true
     * @param {string} name
     * @returns {Promise.<{channel:RabbitMQChannel,queue:RabbitMQQueue}>}
     */
    assertExclusiveQueue (name) {
        const queue = new RabbitMQQueue(name).makeExclusive();
        return this.assertQueue(queue);
    }

    /**
     * Assert queue with parameters exclusive=true and autoDelete=true
     * @param name
     * @returns {Promise.<RabbitMQQueue>}
     */
    assertExclusiveAutoDeleteQueue (name) {
        const queue = new RabbitMQQueue(name).makeExclusive().makeAutoDeleted();
        return this.assertQueue(queue);
    }

    /**
     * Acknowledge message
     * @param msg
     */
    acknowledge (msg) {
        return this._channel.ack(msg);
    }

    /**
     * Bind pattern to queue
     * @param {RabbitMQQueue} queue
     * @param {string} pattern
     * @returns {Promise.<{channel: RabbitMQChannel, queue:RabbitMQQueue}>}
     */
    bindQueue (queue, pattern) {
        return this._channel.bindQueue(queue.name, this.exchange.name, pattern)
        .then(
            ok => {
                return {
                    channel: this,
                    queue: queue
                }
            },
            error => { throw error() }
        );
    }

    /**
     * Delete queue
     * @param {RabbitMQQueue} queue
     * @returns {Promise.<{RabbitMQChannel}>}
     */
    deleteQueue (queue) {
        return this._channel.deleteQueue(queue.name)
            .then(
                ok => this,
                error => { throw error }
            );
    }

    /**
     * Bind message handler to queue
     * @param queue
     * @param handler
     * @param options
     * @returns {Promise.<{channel: RabbitMQChannel, queue: RabbitMQQueue}>}
     */
    consume (queue, handler, options) {
        return this._channel.consume(queue.name, msg => {
            // in some cases we receive null messages
            // on ampqlib page we can see example with such verification: https://www.npmjs.com/package/amqplib
            // it looks like trash messages and we don't need to process them
            if (msg === null) {
                return;
            }
            handler(new RabbitMQMessage(msg));
        }, options)
        .then(
            ok => {
                return {
                    channel: this,
                    queue: queue
                }
            },
            error => { throw error }
        );
    }

    /**
     * Alias for consume. Bind message handler to queue
     * @param {RabbitMQQueue} queue
     * @param {Function} handler
     * @returns {Promise.<{channel: RabbitMQChannel, queue: RabbitMQQueue}>}
     */
    handleQueue (queue, handler) {
        return this.consume(queue, handler, {noAck: false});
    }

    /**
     * Bind message to queue with option noAck=true
     * @param queue
     * @param handler
     * @returns {Promise.<{channel: RabbitMQChannel, queue: RabbitMQQueue}>}
     */
    handleQueueNoAck (queue, handler) {
        return this.consume(queue, handler, {noAck: true})
        .then(
            ok => {
                return {
                    channel: this,
                    queue: queue
                }
            },
            error => { throw error }
        );
    }

    /**
     * Alias for bind queue. Bind pattern to queue.
     * @param {RabbitMQQueue} queue
     * @param {string} pattern
     * @returns {Promise.<{channel: RabbitMQChannel, queue: RabbitMQQueue}>}
     */
    filterByPattern (queue, pattern) {
        return this.bindQueue(queue, pattern);
    }

    /**
     * Add on close listener
     * @param {Function} func
     */
    onClose (func) {
        this._channel.on('close', func);
    }

    /**
     * Execute operation remotely (RPC call)
     * @param {string} operationName
     * @param {Object} operationData
     * @param {string} correlationId
     * @param {string} replyTo
     * @param {{contentType:string}} options
     * @returns {Promise}
     */
    publishOperation (operationName, operationData, correlationId, replyTo, {contentType = 'application/json'} = {}) {
        return this._publish(operationName, operationData,
            {
                correlationId: correlationId,
                replyTo: replyTo,
                contentType: contentType
            }
        );
    }

    /**
     * Publish event to message bus
     * @param {string} eventName
     * @param {string} eventData
     * @param {{contentType:string}} options
     * @returns {Promise}
     */
    publishEvent (eventName, eventData, {contentType = 'application/json'} = {}) {
        return this._publish(eventName, eventData,
            { contentType: contentType }
        );
    }

    /**
     * Reply answer fo executed operation
     * @param replyTo
     * @param data
     * @param correlationId
     * @returns {*}
     */
    reply (replyTo, data, correlationId) {
        return this._channel.sendToQueue(replyTo, new Buffer(data), {correlationId: correlationId});
    }

}