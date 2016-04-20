export class MessageReceiver {

    /**
     *
     * @param {RabbitMQConnector} connector
     * @param {string} exchangeName
     * @param {EventHandlersBucket} handlersBucket
     */
    constructor (connector, exchangeName, handlersBucket) {
        this._connector = connector;
        this._exchangeName = exchangeName;
        this._handlersBucket = handlersBucket;
        this._establishedChannel = null;
        this._establishChannel();
    }

    /**
     * Generate channgel name
     * @param {string} signature
     * @returns {string}
     * @private
     */
    _generateChannelName (signature) {
        return signature;
    }

    /**
     * Establish new channel to publish events
     * @private
     */
    _establishChannel () {
        // Lets store our established channel in promise
        this._establishedChannel = this._connector.ready /* wait until connection established */
        .then(() => this._connector.createChannel())
        .then(channel => {
            channel.onClose(() => this._establishChannel()); // Subscribe to channel close to recreate it
            return channel.assertDirectExchange(this._exchangeName)
        })
        .then( // assert new queue
            channel => channel.assertExclusiveQueue()
        )
        .then( // apply our bindings
            result => {
                const filterApplied = [];
                this._handlersBucket.patterns.forEach(
                    // bindQueue is async operation, so we have to wait until all bindings applied
                    pattern => filterApplied.push(result.channel.bindQueue(result.queue, pattern))
                );
                return Promise.all(filterApplied).then(
                    bindingResult => result // we return previous result because we need channel and queue
                );
            }
        )
        .then( // handle queue messages
            result => result.channel.handleQueue(result.queue, msg => this._handleMessage(msg, result.channel)),
            error => { throw error }
        );
    }

    /**
     * Execute handler to process message and wait for results
     * @param {RabbitMQMessage} msg
     * @param {RabbitMQChannel} channel
     * @private
     */
    _handleMessage (msg, channel) {
        this._handlersBucket.handler.call(null, msg.pattern, msg.content);// execute handler passed during registration
        channel.acknowledge(msg.raw); // Acknowledge message been processed
    }
}