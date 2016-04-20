/**
 * Represents channel exchange
 */
export class RabbitMQExchange {

    /**
     * Exchange type 'direct'
     * @type {string}
     * @constant
     * @static
     */
    static get DIRECT () {
        return 'direct';
    }

    /**
     * Exchange type 'topic'
     * @type {string}
     * @constant
     * @static
     */
    static get TOPIC () {
        return 'topic';
    }

    /**
     *
     * @param {string} name
     * @param {{durable:boolean, internal:boolean, autoDelete:boolean, alternateExchange:boolean,additionalArguments:boolean}} options
     */
    constructor (name, type,
        { //destructuring assignment of exchange options
            durable = false, // if true, the exchange will survive broker restarts
            internal = false, //if true, messages cannot be published directly to the exchange (i.e., it can only be the target of bindings, or possibly create messages ex-nihilo)
            autoDelete = false, // if true, the exchange will be destroyed once the number of bindings for which it is the source drop to zero.
            alternateExchange = null, // (null|string): an exchange to send messages to if this exchange can't route them to any queues.
            additionalArguments = null // (null|Object): any additional arguments that may be needed by an exchange type.
        } = {}
    ) {
        this._name = name;
        if (!RabbitMQExchange.isExchangeTypeValid(type)) {
            throw new Error(`Passed exchange type '${type}' is not valid`);
        }
        this._type = type;
        this._asserted = false
        this._durable = durable;
        this._internal = internal;
        this._autoDelete = autoDelete;
        this._alternateExchange = alternateExchange;
        this._arguments = additionalArguments;
    }

    /**
     * Exchange name
     * @type {string}
     */
    get name () {
        return this._name;
    }

    /**
     * Exchange type
     * @type {string}
     */
    get type () {
        return this._type;
    }

    /**
     * Is exchange active, it means that exchange been asserted and steel active
     * @type {string}
     */
    get isActive () {
        return this._asserted;
    }

    /**
     * Is exchange options can be changed.
     * If exchange already been asserted - we can't change it's options
     * @type {boolean}
     */
    get canChangeOptions () {
        return !this.isAsserted;
    }

    /**
     * Exchange options
     * @type {{durable: (*|boolean), internal: *, autoDelete: *, alternateExchange: *}}
     */
    get options () {
        const options = {
            durable: this._durable,
            internal: this._internal,
            autoDelete: this._autoDelete,
            alternateExchange: this._alternateExchange
        };
        if (this._arguments) {
            options.arguments = this._arguments;
        }
        return options;
    }

    /**
     * Check if passed type is valid exchange type
     * @param {string} type
     * @returns {boolean}
     */
    static isExchangeTypeValid (type) {
        return [RabbitMQExchange.DIRECT, RabbitMQExchange.TOPIC].indexOf(type) != -1;
    }

    /**
     * Set option durable to true
     * @returns {RabbitMQExchange}
     */
    makeDurable () {
        if (!this.canChangeOptions) {
            throw new Error(`You can't change options of already asserted exchange`);
        }
        this._durable = true;
        return this;
    }

    /**
     * Confirm assertion of the exchange
     */
    confirmAssertion () {
        this._asserted = true;
    }


}