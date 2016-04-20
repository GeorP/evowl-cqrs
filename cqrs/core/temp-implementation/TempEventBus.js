import {AbstractEventBus}  from  '../abstraction/AbstractEventBus';
import {AbstractCqrsEventHandler}  from  '../abstraction/AbstractCqrsEventHandler';
import {AbstractCqrsEvent}  from  '../abstraction/AbstractCqrsEvent';
import {TypeMismatchError}  from  '../errors/TypeMismatchError';

/**
 * Temporary implementation of EventBus
 */
export class TempEventBus extends AbstractEventBus {

    constructor () {
        super();
        this._eventHandlersBucket = [];
    }
    
    /**
     * Push new event to bus
     * @param {AbstractCqrsEvent} event
     */
    push (event) {
        if (!(event instanceof AbstractCqrsEvent)) {
            throw new TypeMismatchError('AbstractCqrsEvent', event);
        }
        this._eventHandlersBucket.filter(handler => handler.match(event))
                            .map(handler => handler.handle(event));
    }

    /**
     * Register event handler in event bus
     * @param {AbstractCqrsEventHandler} eventHandler
     */
    registerEventHandler (eventHandler) {
        if (!(eventHandler instanceof AbstractCqrsEventHandler)) {
            throw new TypeMismatchError('AbstractCqrsEventHandler', eventHandler)
        }
        this._eventHandlersBucket.push(eventHandler);
    }
}