import {NotImplementedError} from '../errors/NotImplementedError';

/**
 * Abstract class describes interface of Event Bus
 */
export class AbstractEventBus {

    /**
     * Push new event to bus
     * @param {AbstractCqrsEvent} event
     */
    push (event) {
        throw new NotImplementedError('push', AbstractEventBus.name);
    }

    /**
     * Register event handler in event bus
     * @param {AbstractCqrsEventHandler} eventHandler
     */
    registerEventHandler (eventHandler) {
        throw new NotImplementedError('registerEventHandler', AbstractEventBus.name);
    }
}