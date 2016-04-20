export class MessageSender {
    /**
     *
     * @param {RabbitMQConnector} connector
     * @param {string} exchangeName
     */
    constructor (connector, exchangeName) {
        this._connector = connector;
        this._exchangeName = exchangeName;
        this._establishedChannel = null;
        this._establishChannel();
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
        });
    }

    /**
     * Publish new event
     * @param {string} eventName
     * @param {Object} eventData
     */
    publish (eventName, eventData) {
        this._establishedChannel.then(
            channel => channel.publishEvent(eventName, new Buffer(eventData))
        );
    }


}