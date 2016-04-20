import {AbstractDenormalizer} from '../../../core/abstraction/AbstractDenormalizer';
import {FooPingedEvent} from '../events/FooPingedEvent';
import {FooPongAnsweredEvent} from '../events/FooPongAnsweredEvent';
import {PingPongView} from '../views/PingPongView';
import {CqrsEventHandlersBucket} from '../../../core/CqrsEventHandlersBucket';

export class PingPongDenormalizer extends AbstractDenormalizer {

    static get meta () {
        return {
            type: 'Denormalizer',
            name: PingPongDenormalizer.name,
            version: '1.0'
        }
    }

    /**
     * Name of the denormalizer
     * @returns {string}
     */
    static get name () {
        return 'foo/ping-pong';
    }

    /**
     *
     * @param {TempViewRepository} viewRepository
     */
    constructor (viewRepository) {
        super(PingPongDenormalizer.name, viewRepository);
        this._eventHandlersBucket = new CqrsEventHandlersBucket(PingPongDenormalizer.meta.name);

        this._initEventHandlers();
    }

    /**
     * Init event handlers
     * @private
     */
    _initEventHandlers () {
        this._eventHandlersBucket.addHandler(
            FooPingedEvent,
            event => this.on_Ping(event)
        );

        this._eventHandlersBucket.addHandler(
            FooPongAnsweredEvent,
            event => this.on_Pong(event)
        );
    }

    /**
     * Process ping event
     * @param {FooPingedEvent} event
     * @private
     */
    on_Ping (event) {
        const view = new PingPongView(event.requestID, event.aggregateID, event.byWho);
        this._vr.put(view);
    }

    /**
     * Process PongAnswered event
     * @param {FooPongAnsweredEvent} event
     */
    on_Pong (event) {
        this._vr.get(event.requestID, PingPongView).then(
            (// view loaded
                view => {
                    view.setPong(event.dt, event.answer);
                    this._vr.put(view);
                }
            ),
            (// error loading view
                error => {
                    console.log('Processing event ', event);
                    console.log('Error loading view:', error);
                    console.log(error.stack);
                }
            )
        );
    }

    /**
     *
     * @returns {Array.<AbstractCqrsEventHandler>}
     */
    get eventHandlersBucket () {
        return this._eventHandlersBucket;
    }
}