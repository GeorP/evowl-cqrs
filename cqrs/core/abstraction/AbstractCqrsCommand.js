import {NotImplementedError} from '../errors/NotImplementedError';

/**
 * Abstract class to define Command interface
 */
export class AbstractCqrsCommand {

    /**
     *
     * @param {string} cmd
     * @param {uuid} uuid
     */
    constructor (cmd, uuid) {
        this._cmd = cmd;
        this._uuid = uuid;
    }

    /**
     *
     * @type {uuid}
     */
    get uuid () {
        return this._uuid;
    }

    /**
     * Returns cmd of the command
     * @type {string}
     */
    get cmd () {
        return this._cmd
    }

    /**
     * Return object that contains all data related to command
     * @type {Object}
     */
    get data () {
        throw new NotImplementedError('AbstractCqrsCommand', 'data');
    }

    /**
     * Serialize command to flat object
     * @returns {{type: string, cmd: string, data: Object}}
     */
    toObject () {
        return {
            type: this.constructor.name, //to identify whta type of object it is
            cmd: this.cmd,
            uuid: this.uuid,
            data: this.data
        }
    }

    /**
     * Serialize command to String
     * @returns {string}
     */
    toString () {
        return JSON.stringify(this.toObject());
    }

}