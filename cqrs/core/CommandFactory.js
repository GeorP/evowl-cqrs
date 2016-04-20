const uuid = require('node-uuid');

/**
 * Part of application public interface to allow command creation
 */
export class CommandFactory {

    constructor (logger) {
        this._logger = logger.getInterface('CommandFactory');
        this._dict = {};
    }

    /**
     * Generate uniq id for the command
     * @returns {uuid}
     * @private
     */
    _generateID () {
        return uuid.v4();
    }

    /**
     * Create new command object
     * @param {string} cmd
     * @param {object} data
     * @param {uuid} uuid
     * @returns {AbstractCqrsCommand}
     */
    create (cmd, data, uuid = this._generateID()) {
        if (!this.isCommand(cmd)) {
            // TODO: write custom error
            throw new Error(`Command ${cmd} not registered in this node`);
        }
        return this._dict[cmd].create(uuid, data);
    }

    /**
     * Check if command with specific cmd registered in factory
     * @param {string} cmd
     * @returns {boolean}
     */
    isCommand (cmd) {
        return this._dict[cmd] ? true : false;
    }

    /**
     * Register new command class (constructor) in command factory
     * @param {AbstractCqrsCommand} commandCtor
     */
    registerCommand (commandCtor) {
        this._dict[commandCtor.cmd] = commandCtor;
    }

    restore (serializedCmd) {
        this._logger.debug('Restoring command', serializedCmd);
        return this.create(serializedCmd.cmd, serializedCmd.data, serializedCmd.uuid);
    }
}