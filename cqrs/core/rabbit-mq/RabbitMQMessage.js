/**
 * Represents RabbitMQ message
 */
export class RabbitMQMessage {

    /**
     *
     * @param {Object} msg
     */
    constructor (msg) {
        this._msg = msg;
    }

    /**
     * @type {Object}
     */
    get content () {
        return JSON.parse(this._msg.content.toString())
    }

    /**
     * @type {string}
     */
    get contentEncoding () {
        return this._msg.properties.contentEncoding;
    }

    /**
     * @type {string}
     */
    get contentRaw () {
        return this._msg.content;
    }

    /**
     * @type {string}
     */
    get contentType () {
        return this._msg.properties.contentType;
    }

    /**
     * @type {string}
     */
    get correlationId () {
        return this._msg.properties.correlationId;
    }

    /**
     * @type {boolean}
     */
    get isEmpty () {
        return !this._msg;
    }

    /**
     *
     * @type {string}
     */
    get pattern () {
        return this._msg.fields.routingKey;
    }

    /**
     * @type {Object}
     */
    get raw () {
        return this._msg;
    }

    /**
     * @type {string}
     */
    get replyTo () {
        return this._msg.properties.replyTo;
    }
}