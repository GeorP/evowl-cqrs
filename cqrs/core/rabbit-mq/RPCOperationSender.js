// See documentation: http://www.squaremobius.net/amqp.node/channel_api.html
const uuid = require('node-uuid');

/**
 * Operation sender. Provides interface to execute operations remotely using RabbitMQ
 */
export class RPCOperationSender {

    /**
     *
     * @param {RabbitMQConnector} connector
     * @param {string} exchangeName
     */
    constructor (connector, exchangeName) {
        this._connector = connector;
        this._exchangeName = exchangeName;
    }

    /**
     * Promise that will be resolved once object ready to send operations
     * @returns {Promise.<RPCOperationSender>}
     */
    get ready () {
        return this._connector.ready.then(() => this);
    }

    /**
     * Creates channel and assert exchange
     * @returns {Promise.<RabbitMQChannel>}
     * @private
     */
    _createChannelExchange () {
        return this._connector.ready
        .then(() => this._connector.createChannel())
        .then(channel => channel.assertDirectExchange(this._exchangeName));
    }

    /**
     * Execute operation async and return promise that will be resolved with result of operation execution
     * @param {string} operationName
     * @param {string} operationData
     * @returns {Promise}
     */
    execute (operationName, operationData) {
        //Generate correlation that will be unique for this operation;
        const correlationId = uuid.v4();
        let responseQueue;

        // We returning promise that will be resolved with result of command execution
        // Or rejected with error
        return new Promise((resolve, reject) => {
            //TODO: think, do we really need create new queue for each operation result, or we can reuse one
            // First of all we should create queue where we will get the operation result
            this._createChannelExchange().then(
                channel => channel.assertExclusiveAutoDeleteQueue()
            ).then(
                result => { // new queue have been generated, q.queue - identifier of new queue
                    responseQueue = result.queue;
                    const channel = result.channel;
                    // subscribe to get response for our operation
                    // promise will be resolved when subscription approved by server
                    return channel.handleQueueNoAck(responseQueue.name, (msg) => { // this is our handler for operation result

                        // We'd better check correlation id, details see here:
                        // https://www.rabbitmq.com/tutorials/tutorial-six-javascript.html
                        if (msg.correlationId == correlationId) {
                            // we got result of our operation, now we can resolve promise;
                            resolve(msg.content);
                            channel.deleteQueue(responseQueue).then(
                                //TODO: think do we need to react somehow on this
                                ok => { ; },
                                //TODO: log error somehow
                                error => { reject(error) }
                            );
                        }
                    }); //noAck: if true, the broker won't expect an acknowledgement of messages
                    // delivered to this consumer; i.e.,
                    // it will dequeue messages as soon as they've been sent down the wire. Defaults to false
                },
                error => { reject(error); }
            ).then(
                result => {
                    //do send message here
                    result.channel.publishOperation(operationName, operationData, correlationId, responseQueue.name);
                },
                error => { reject(error); }
            );
        });

    }

}