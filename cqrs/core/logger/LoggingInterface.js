import {LogRecord} from './LogRecord';
import {joinLocation, mergeTags,
    LOG_EMERGENCY, LOG_ALERT, LOG_CRITICAL, LOG_ERROR, LOG_WARNING, LOG_NOTICE, LOG_INFORMATIONAL, LOG_DEBUG} from './LogUtils';

/**
 * Provides logging interface
 */
export class LoggingInterface {

    /**
     *
     * @param {Array.<string>} tags
     * @param {string} location
     * @param {Function} saveFunc
     */
    constructor ({tags=[], location=''}, saveFunc) {
        this._saveFunc = saveFunc;
        this._tags = tags;
        this._location = location;
    }

    /**
     * Get new log record
     * @param {string} message
     * @returns {LogRecord}
     */
    l (message) {
        return new LogRecord(this._tags, this._location, message, record => {
            this._saveFunc(record);
        });
    }

    /**
     * Log record
     * @param {string} message
     * @param {*} data
     * @param {string} loc
     * @param {Array.<string>|string} tags
     */
    log (message, data=null, loc=null, tags=[]) {
        this.l(message).data(data).loc(loc).tag(tags).log();
    }

    /**
     * Log with Emergency tag
     * @param {string} message
     * @param {*} data
     * @param {string} loc
     * @param {Array.<string>|string} tags
     */
    emerg (message, data=null, loc=null, tags=[]) {
        this.log(message, data, loc, mergeTags(tags, LOG_EMERGENCY));
    }

    /**
     * Log with Alert tag
     * @param {string} message
     * @param {*} data
     * @param {string} loc
     * @param {Array.<string>|string} tags
     */
    alert (message, data=null, loc=null, tags=[]) {
        this.log(message, data, loc, mergeTags(tags, LOG_ALERT));
    }

    /**
     * Log with Critical tag
     * @param {string} message
     * @param {*} data
     * @param {string} loc
     * @param {Array.<string>|string} tags
     */
    crit (message, data=null, loc=null, tags=[]) {
        this.log(message, data, loc, mergeTags(tags, LOG_CRITICAL));
    }

    /**
     * Log with Error tag
     * @param {string} message
     * @param {*} data
     * @param {string} loc
     * @param {Array.<string>|string} tags
     */
    error (message, data=null, loc=null, tags=[]) {
        this.log(message, data, loc, mergeTags(tags, LOG_ERROR));
    }

    /**
     * Log with Warning tag
     * @param {string} message
     * @param {*} data
     * @param {string} loc
     * @param {Array.<string>|string} tags
     */
    warning (message, data=null, loc=null, tags=[]) {
        this.log(message, data, loc, mergeTags(tags, LOG_WARNING));
    }

    /**
     * Log with Notice tag
     * @param {string} message
     * @param {*} data
     * @param {string} loc
     * @param {Array.<string>|string} tags
     */
    notice (message, data=null, loc=null, tags=[]) {
        this.log(message, data, loc, mergeTags(tags, LOG_NOTICE));
    }

    /**
     * Log with Info tag
     * @param {string} message
     * @param {*} data
     * @param {string} loc
     * @param {Array.<string>|string} tags
     */
    info (message, data=null, loc=null, tags=[]) {
        this.log(message, data, loc, mergeTags(tags, LOG_INFORMATIONAL));
    }

    /**
     * Log with Debug tag
     * @param {string} message
     * @param {*} data
     * @param {string} loc
     * @param {Array.<string>|string} tags
     */
    debug (message, data=null, loc=null, tags=[]) {
        this.log(message, data, loc, mergeTags(tags, LOG_DEBUG));
    }

    /**
     * Serialize error to object
     * @param {Error} error
     * @returns {{type: string, msg: string, stack: string}}
     */
    serializeError (error) {
       return {
           type: error.name,
           msg: error.message,
           stack: error.stack
       }
    }

    /**
     * Get interface that inherits tag and location
     * @param {string} loc
     * @param {Array.<string>|string} tags
     * @returns {LoggingInterface}
     */
    getInterface (loc, tags) {
        return new LoggingInterface({
                tags: mergeTags(this._tags.slice(), tags),
                location: joinLocation(this._location, loc)
            },
            this._saveFunc
        );
    }
}