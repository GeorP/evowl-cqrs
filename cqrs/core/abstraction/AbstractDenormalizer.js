import {NotImplementedError} from '../errors/NotImplementedError';

/**
 * Abstract class describes Denormalizer interface
 */
export class AbstractDenormalizer {

    /**
     *
     * @param {string} name
     * @param {AbstractViewRepository} viewRepository
     */
    constructor (name, viewRepository) {
        this._name = name;
        this._vr = viewRepository;
    }

    static get name () {
        throw new NotImplementedError('getter/cmd', 'AbstractDenormalizer');
    }

    get eventHandlers () {
        throw new NotImplementedError('getter/eventHandlersBucket', 'AbstractDenormalizer');
    }

}
