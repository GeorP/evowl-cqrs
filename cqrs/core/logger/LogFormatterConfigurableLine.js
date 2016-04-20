import {AbstractLogFormatter} from './AbstractLogFormatter';
import {hasLogLevel, logLevelLabel,
        LOG_EMERGENCY,LOG_ALERT, LOG_CRITICAL, LOG_ERROR,
        LOG_WARNING, LOG_NOTICE, LOG_INFORMATIONAL, LOG_DEBUG} from './LogUtils';

export const CONF_LINE_LEVELS_FROM_WARN = [LOG_EMERGENCY,LOG_ALERT, LOG_CRITICAL, LOG_ERROR, LOG_WARNING];
export const CONF_LINE_LEVELS_ALL = [LOG_EMERGENCY,LOG_ALERT, LOG_CRITICAL, LOG_ERROR, LOG_WARNING, LOG_NOTICE, LOG_INFORMATIONAL, LOG_DEBUG];

/**
 * Format log record as single line, the order of the parts can be configurable
 * @extends AbstractLogFormatter
 */
export class LogFormatterConfigurableLine extends AbstractLogFormatter{

    constructor () {
        super();
        this._levelIndicator = [];
        this._sectionSeparator = '\t';
        this.reset();
    }

    /**
     * Reset format to default value
     * @returns {LogFormatterConfigurableLine}
     */
    reset () {
        this.levelIndicator(CONF_LINE_LEVELS_FROM_WARN);
        return this;
    }

    /**
     * Do not show any level indicators at the beginning of the string
     * @returns {LogFormatterConfigurableLine}
     */
    disableLevelIndicator () {
        this._showLevelIndicator = [];
        return this;
    }

    /**
     * Set indicator levels that should be indicated in the beginning of the line
     * @param levels
     * @returns {LogFormatterConfigurableLine}
     */
    levelIndicator (levels) {
        this._levelIndicator = levels;
        return this;
    }

    /**
     * Indicate all levels
     * @returns {LogFormatterConfigurableLine}
     */
    indicateAllLevels () {
        this.levelIndicator(CONF_LINE_LEVELS_ALL);
        return this;
    }

    /**
     * Format log record
     * @param {LogRecord} logRecord
     * @returns {string}
     */
    format (logRecord) {
        const separator = this._sectionSeparator;

        const logData = logRecord.toObject();
        const tags = logData.tags;

        // search for log level or just assign empty string if our _levelIndicator array is empty
        let logLevel = this._levelIndicator.length ? logLevelLabel(hasLogLevel(tags, this._levelIndicator)) : '';

        const dt = `[${logData.dt.toLocaleString()}]`;
        const msg = logData.message;
        const loc = logData.location;
        let attachedData = logData.data;
        if (attachedData instanceof Error) {
            attachedData = {
                type: attachedData.name,
                msg: attachedData.message,
                stack: attachedData.stack
            }
        }
        if (typeof attachedData === 'object' && attachedData !== null) {
            if ('toObject' in attachedData) {
                attachedData = JSON.stringify(attachedData.toObject());
            } else {
                attachedData = JSON.stringify(attachedData);
            }
        }
        return [logLevel, dt, msg, loc, attachedData, tags, '\n'].join(separator);
    }

}
