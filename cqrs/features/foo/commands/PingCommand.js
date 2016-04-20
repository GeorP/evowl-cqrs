import {CqrsCommand} from '../../../core/CqrsCommand';

/**
 * Ping command class
 */
export class PingCommand extends CqrsCommand {

    /**
     *
     * @returns {string}
     */
    static get cmd () {
        return 'foo.ping';
    }

    /**
     * Simple factory that return new instance of the Ping command
     * @param {uuid} uuid
     * @param {{requestID:string, targetID:uuid, byWho:string}} data
     * @returns {PingCommand}
     */
    static create (uuid, {requestID, targetID, byWho}) {
        return new PingCommand(uuid, requestID, targetID, byWho);
    }

    /**
     * @param {uuid} uuid
     * @param {uuid} requestID
     * @param {uuid} targetID
     * @param {string} byWho
     */
    constructor (uuid, requestID, targetID, byWho) {
        super(PingCommand.cmd, uuid);

        this._requestID = requestID;
        this._targetID = targetID;
        this._byWho = byWho;
    }

    /**
     *
     * @returns {string}
     */
    get cmd () {
        return PingCommand.cmd;
    }

    /**
     *
     * @returns {uuid}
     */
    get requestID () {
        return this._requestID;
    }

    /**
     * @returns {uuid}
     */
    get targetID () {
        return this._targetID;
    }

    /**
     * @returns {string}
     */
    get byWho () {
        return this._byWho;
    }

    /**
     * Return object that contains all data related to command
     * @returns {{cmd: string, targetID: uuid, byWho: string}}
     */
    get data () {
        return {
            requestID: this.requestID,
            name: this.cmd,
            targetID: this.targetID,
            byWho: this.byWho
        }
    }
}