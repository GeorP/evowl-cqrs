import {AbstractAggregate} from '../../../core/abstraction/AbstractAggregate';
import {FooPingedEvent} from './../events/FooPingedEvent';
import {FooPongAnsweredEvent} from './../events/FooPongAnsweredEvent';

/**
 * The only one Aggregate of Foo feature
 * It can be pinged
 */
export class FooAggregate extends AbstractAggregate {

    /**
     * Aggregate entity name
     * @returns {string}
     */
    static get aggregateName () {
        return 'Foo';
    }

    /**
     * Create new instance
     * @param {uuid} uuid
     * @param {number} originVersion
     * @returns {FooAggregate}
     */
    static create (uuid, originVersion) {
        return new FooAggregate(uuid, originVersion);
    }

    /**
     * Metainformation about Aggregate
     * @returns {{type: *, name: string, version: string}}
     */
    static get meta () {
        return {
            type: FooAggregate.name,
            name: FooAggregate.aggregateName,
            version: '1.0'
        };
    }

    /**
     *
     * @param {uuid} uuid
     * @param {number} originVersion
     */
    constructor (uuid, originVersion) {
        super(FooAggregate.aggregateName, uuid, originVersion);
    }

    /**
     * Ping our Foo object
     * @param {uuid} requestID
     * @param {string} byWho
     */
    ping (requestID, byWho) {
        const fooPinged = new FooPingedEvent(this.uuid, requestID, byWho);
        this.rise(fooPinged);
    }

    /**
     * Apply 'foo_pinged' event
     * @param {FooPingedEvent} event
     */
    apply_foo_pinged (event) {
        const fooPongAnswered = new FooPongAnsweredEvent(event.requestID, new Date().getTime(), `Hi ${event.byWho}`);
        this.rise(fooPongAnswered);
    }

    /**
     * Apply 'foo_pong_answered' event - doing nothing
     * @param {FooPongAnsweredEvent} event
     */
    apply_foo_pong_answered (event) {
        // doing nothing
    }

}