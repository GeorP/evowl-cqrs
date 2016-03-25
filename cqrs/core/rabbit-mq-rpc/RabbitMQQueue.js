/**
 * Represents RabbitMQ Que
 */
export class RabbitMQQueue {

    /**
     *
     * @param {string} name
     * @param {{exclusive: boolean, durable: boolean, autoDelte: boolean, additionalArguments: Object}} options
     */
    constructor (name = '',
        {
            exclusive = true, // if true, scopes the queue to the connection
            durable = false, // if true, the queue will survive broker restarts
            autoDelete = false, // if true, the queue will be deleted when the number of consumers drops to zero
            additionalArguments = null // additional arguments, usually parameters for some kind of broker-specific extension e.g., high availability, TTL
        } = {}
    ) {

        this._name = name;
        this._autoGenerated = name === '';
        this._q = null;
        this._exclusive = exclusive;
        this._durable = durable;
        this._autoDelete = autoDelete;
        this._arguments = additionalArguments;
    }

    /**
     *
     * @type {string}
     */
    get name () {
        return this._name;
    }

    /**
     * Check if queue cmd was auto generate.
     * If it is - then cmd will be available only after queue assetion
     * @type {boolean}
     */
    get isAutoGenerated () {
        return this._autoGenerated;
    }

    /**
     * Returns options for queue assertion
     * @type {{exclusive: (*|boolean), durable: *, autoDelete: (*|boolean)}}
     */
    get options () {
        const options = {
            exclusive: this._exclusive,
            durable: this._durable,
            autoDelete: this._autoDelete
        };
        if (this._arguments) {
            options.arguments = this._arguments;
        }
        return options;
    }

    /**
     * Check if queue options can be changed.
     * It is possible if queue not yet been asserted
     * @returns {boolean}
     */
    canBeChanged () {
        return this._q === null;
    }

    /**
     * Set exclusive option to true
     * @returns {RabbitMQQueue}
     */
    makeExclusive () {
        if (!this.canBeChanged()) {
            // TODO: Rewrite to custom error
            throw new Error(`Queue can't be changed in current stete`);
        }
        this._exclusive = true;
        return this;
    }

    /**
     * Set autoDelete option to true
     * @returns {RabbitMQQueue}
     */
    makeAutoDeleted () {
        if (!this.canBeChanged()) {
            // TODO: Rewrite to custom error
            throw new Error(`Queue can't be changed in current stete`);
        }
        this._autoDelete = true;
        return this;
    }

    /**
     * Confirm assertion and pass data returned by RabbitMQ
     * @param q
     */
    confirmAssertion (q) {
        this._q = q;
        this._name = q.queue;
    }
}