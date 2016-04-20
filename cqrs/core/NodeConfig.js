import {NotImplementedError} from './errors/NotImplementedError';

/**
 * Represent configuration of certain CQRS node
 */
export class NodeConfig {

    constructor () {
        this._features = [];
        this._aggregateRepository = null;
        this._commandBus = null;
        this._ESAdapter = null;
        this._queryBus = null;
        this._viewRepository = null;
        this._eventBus = null;
        this._rabbitMQConnector = null;
        this._rabbitMQHost = null;
        this._commandBusExchange = null;
        this._eventBusExchange = null;
        this._logger = null;
    }

    /**
     * @param {AbstractAggregateRepository} value
     */
    set aggregateRepository (value) {
        //if (!(value instanceof AbstractAggregateRepository)) {
        //    throw new TypeMismatchError('AbstractAggregateRepository', value);
        //}
        this._aggregateRepository = value;
    }

    /**
     * @returns {AbstractAggregateRepository}
     */
    get aggregateRepository () {
        return this._aggregateRepository;
    }

    /**
     *
     * @param {string} value
     */
    set commandBusExchange (value) {
        this._commandBusExchange = value;
    }

    /**
     *
     * @returns {string}
     */
    get commandBusExchange () {
        return this._commandBusExchange;
    }

    /**
     *
     * @param {string} value
     */
    set eventBusExchange (value) {
        this._eventBusExchange = value;
    }

    /**
     *
     * @returns {string}
     */
    get eventBusExchange () {
        return this._eventBusExchange;
    }

    /**
     *
     * @returns {Array.<Feature>}
     */
    get features () {
        return this._features;
    }


    /**
     * @param {AbstractCommandBus} value
     */
    set commandBus (value) {
        //if (!(value instanceof AbstractCommandBus)) {
        //    throw new TypeMismatchError('AbstractCommandBus', value);
        //}
        this._commandBus = value;
    }

    /**
     * @returns {AbstractCommandBus}
     */
    get commandBus () {
        return this._commandBus;
    }

    /**
     *
     * @param {AbstractEventBus} value
     */
    set eventBus (value) {
        this._eventBus = value;
    }

    /**
     *
     * @returns {AbstractEventBus}
     */
    get eventBus () {
        return this._eventBus;
    }

    /**
     * @param {AbstractEventStoreAdapter} value
     */
    set eventStoreAdapter (value) {
        //if (!(value instanceof AbstractEventStoreAdapter)) {
        //    throw new TypeMismatchError('AbstractEventStoreAdapter', value);
        //}
        this._ESAdapter = value;
    }

    /**
     * @returns {AbstractEventStoreAdapter}
     */
    get eventStoreAdapter () {
        return this._ESAdapter;
    }

    /**
     *
     * @param {Logger} value
     */
    set logger (value) {
        this._logger = value;
    }

    /**
     *
     * @returns {Logger}
     */
    get logger () {
        return this._logger;
    }

    /**
     *
     * @param {AbstractQueryBus} value
     */
    set queryBus (value) {
        this._queryBus = value;
    }

    /**
     *
     * @returns {AbstractQueryBus}
     */
    get queryBus () {
        return this._queryBus;
    }

    /**
     *
     * @param {RabbitMQConnector} value
     */
    set rabbitMQConnector (value) {
        this._rabbitMQConnector = value;
    }

    /**
     *
     * @type {RabbitMQConnector}
     */
    get rabbitMQConnector () {
        return this._rabbitMQConnector;
    }

    /**
     *
     * @param {string} value
     */
    set rabbitMQHost (value) {
        this._rabbitMQHost = value;
    }

    /**
     *
     * @returns {string}
     */
    get rabbitMQHost () {
        return this._rabbitMQHost;
    }

    /**
     *
     * @param {AbstractViewRepository} value
     */
    set viewRepository (value) {
        this._viewRepository = value;
    }

    /**
     *
     * @returns {AbstractViewRepository}
     */
    get viewRepository () {
        return this._viewRepository;
    }

    /**
     * Add new feature to configuration
     * @param {Feature} feature
     */
    addFeature (feature) {
        this._features.push(feature);
    }

    /**
     * This method should check consistency of our settigs, to be sure that we have all neded option to run the node
     */
    checkConsistency () {
        throw new NotImplementedError('checkConsistency', 'NodeConfig');
    }
}