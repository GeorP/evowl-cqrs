/**
 * Part of application public interface to allow query creation
 */
export class QueryFactory {

    constructor () {
        this._dict = {};
    }

    /**
     * Register new query class (constructor)
     * @param {AbstractQuery} queryCtor
     */
    register (queryCtor) {
        this._dict[queryCtor.name] = queryCtor;
    }

    /**
     * Check if query with specific cmd registered in factory
     * @param {string} name
     * @returns {boolean}
     */
    isQuery (name) {
        return this._dict[name] ? true : false;
    }

    /**
     * Create new query object
     * @param {string} name
     * @param {object} data
     * @returns {AbstractQuery}
     */
    create (name, data) {
        if (!this.isQuery(name)) {
            // TODO: write custom error
            throw new Error(`Query ${name} not registered in this node`);
        }
        return this._dict[name].create(data);
    }
}