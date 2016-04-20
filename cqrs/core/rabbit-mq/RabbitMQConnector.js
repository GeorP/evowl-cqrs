import {RabbitMQChannel} from './RabbitMQChannel';
const amqp = require('amqplib');

/**
 * Represents connection to RabbitMQ server
 */
export class RabbitMQConnector {
    /**
     *
     * @param {host: string} config
     */
    constructor (config) {
        /**
         * Host of the RabbitMQ server
         * @type {string}
         * @protected
         */
        this._host = config.host;

        /**
         * Holds connection to RabbitMQ server
         * @protected
         */
        this._connection = null;


        this._channels = [];
        this._ready = null;
        this._isReady = false;
    }

    /**
     * Return promise that will be resolved when client ready to execute commands
     * Or will be rejected in case of error
     * @type {Promise.<T>}
     */
    get ready () {
        return this._ready;
    }

    /**
     * Check if client ready to execute commands
     * @returns {boolean}
     */
    get isReady () {
        return this._isReady;
    }

    /**
     * Get connection object
     * @returns {Object}
     */
    get connection () {
        return this._connection;
    }

    /**
     * Connect to RabbitMQ server
     * @returns {Promise.<RabbitMQConnector>}
     */
    connect () {
        this._ready = amqp.connect(this._host).then( // connect to RabbitMQ server
            conn => {
                this._connection = conn;
                this._isReady = true;
                return this;
            },
            error => { throw error }
        );
        return this.ready;
    }

    /**
     * Create new channel within this connection
     * @param channelName
     * @returns {Promise.<RabbitMQChannel>}
     */
    createChannel (channelName) {
        return this.ready.then(() => this._connection.createChannel())
        .then(
            ch => {
                const channel =  new RabbitMQChannel(channelName, ch);
                channel.onClose(() => this.removeChannel(channel));
                this._channels.push(channel);
                return channel;
            }
        );
    }

    /**
     * Get channel by it's name
     * @param name
     * @returns {RabbitMQChannel}
     */
    getChannel (name) {
        return this._channels.find(channel => channel.name === name);
    }

    /**
     * Remove channel from saved list
     * @param channel
     */
    removeChannel (channel) {
        const pos = this._channels.indexOf(channel);
        if (pos === -1) {
            return;
        }
        this._channel.splice(pos, 1);
    }
}