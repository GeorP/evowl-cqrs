import {AbstractCqrsCommand} from './abstraction/AbstractCqrsCommand';

/**
 * Generic CqrsCommand class
 */
export class CqrsCommand extends AbstractCqrsCommand {

    /**
     *
     * @param {string} cmd Name of the command
     * @param {uuid} uuid Unique identifier of the command
     */
    constructor (cmd, uuid) {
        super(cmd, uuid);

        /**
         * Stores data related to the command
         * @type {object|null}
         * @protected
         */
        this._data = null;
    }

    /**
     *
     * @param {*} value
     */
    set data (value) {
        this._data = value;
    }

    /**
     *
     * @type {*}
     */
    get data () {
        return this._data;
    }
}