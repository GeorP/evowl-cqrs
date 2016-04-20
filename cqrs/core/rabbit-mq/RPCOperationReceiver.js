/**
 * Operation receiver. Used to handle operations in RPC model and send answers using RabbitMQ
 */
export class RPCOperationReceiver {

    /**
     *
     * @param {RabbitMQConnector} connector
     * @param {string} exchangeName
     */
    constructor (connector, exchangeName) {
        this._connector = connector;
        this._exchangeName = exchangeName;
        this._patterns = [];
    }

    /**
     * Promise that will be resolved once object ready to receive operations
     * @type {Promise.<RPCOperationReceiver>}
     */
    get ready () {
        return this._connector.ready.then(() => this);
    }

    /**
     * Generate cmd for channel based on pattern
     * @param {string} pattern
     * @returns {string}
     * @protected
     */
    _channelNameForPattern (pattern) {
        return `ch_${pattern}`;
    }

    /**
     * Save info about pattern in this class
     * @param {string} pattern
     * @private
     */
    _registerPattern (pattern) {
        this._patterns.push(pattern);
    }

    /**
     * Execute handler to process message and wait for results
     * @param {Function} handler
     * @param {RabbitMQMessage} msg
     * @param {RabbitMQChannel} channel
     * @private
     */
    _handleMessage (handler, msg, channel) {
        handler.call(null, msg.content).then( // execute handler passed during registration
            result => { // wait until processing
                // Send result back result of operation
                channel.reply(msg.replyTo, result, msg.correlationId);
                channel.acknowledge(msg.raw); // Acknowledge message been processed
            }
        );
    }

    /**
     * Register new handler
     * @param {string} pattern
     * @param {Function} handler
     * @returns {Promise.<boolean>}
     */
    registerHandler (pattern, handler) {
        this._registerPattern(pattern); // Register pattern in class

        return this._connector.createChannel(this._channelNameForPattern(pattern)) // create new channel
        .then( // assert exchange
            channel => channel.assertDirectExchange(this._exchangeName)
        )
        .then( // assert new queue
            channel => channel.assertExclusiveQueue()
        )
        .then( // apply filter by our pattern
            result => result.channel.filterByPattern(result.queue, pattern)
        )
        .then( // handle queue messages
            result => result.channel.handleQueue(result.queue, msg => this._handleMessage(handler, msg, result.channel)),
            error => { throw error }
        )
        .then(
            result => true,
            error => { throw error }
        );
    }

}