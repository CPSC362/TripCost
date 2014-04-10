/*
|--------------------------------------------------------------------------
| Persistence
|--------------------------------------------------------------------------
|
| Created by Austin White <austinw@csu.fullerton.edu>
| California State University, Fullerton CPSC 362
| February 26, 2014
| 
| Requires storageInterface which is a function with the following
| methods: getItem(key), setItem(key, object), removeItem(key)
|
*/
var Persistence = (function() {

    // Constructor method
    function Persistence(storageInterface) {
        this.adapter = storageInterface;
    };

    Persistence.prototype = {

        /**
         * Get an item by key from persistent storage
         * @param  {string} key
         * @return {mixed}
         */
        get: function(key) {
            var item = JSON.parse(this.adapter.getItem(key));

            if (!item) return null;

            if (item.timestamp < 0 || new Date().getTime() < item.timestamp) {
                return JSON.parse(item.value);
            } else {
                return this.delete(key);
            }
        },

        /**
         * Set an item by key in persistent storage
         * @param {string} key
         * @param {mixed} value          Can contain primitive types, arrays, or objects
         * @param {integer} expiration   Expiration timestamp in terms of seconds (or -1 for infinite)
         */
        set: function(key, value, expiration) {

            var expiration = (expiration) ? expiration * 60 * 1000 : -1;

            var item = {
                value: JSON.stringify(value),
                timestamp: (expiration > 0) ? new Date().getTime() + expiration : expiration
            };

            this.adapter.setItem(key, JSON.stringify(item));
        },

        /**
         * Delete an item from persistent storage
         * @param  {string} key
         * @return {void}
         */
        delete: function(key) {
            this.adapter.removeItem(key);
        },

        /**
         * Push an something onto an array item within persistent storage
         * @param  {string} key
         * @param  {mixed} value          Can contain primitive types, arrays, or objects
         * @param  {integer} expiration   Expiration timestamp in terms of seconds (or -1 for infinite)
         * @return {void}
         */
        pushItem: function(key, value, expiration) {

            var item = this.get(key) || [];

            DEBUG && console.log(value);

            if (item != null && item instanceof Array) {
                item.push(value);
                this.set(key, item, expiration);
            }
        },

        /**
         * Delete a member of an array item within persistent storage
         * @param  {string} key
         * @param  {integer} index
         * @param  {integer} expiration   Expiration timestamp in terms of seconds (or -1 for infinite)
         * @return {void}
         */
        deleteAt: function(key, index, expiration) {

            var item = this.get(key);

            console.log("deleting " + key + " at " + index);

            if (item != null && item instanceof Array) {
                item.splice(index, 1);

                this.set(key, item, expiration);
            }
        },

        /**
         * Search through an array item using a predicate (closure) for the test and delete it
         * @param  {string} key
         * @param  {function} predicate    Function that returns a boolean
         * @return {void}
         */
        searchAndDelete: function(key, predicate) {
            var objects = this.get(key);

            if (objects) {
                for (var i = 0, s = objects.length; i < s; ++i) {
                    if (predicate(objects[i])) {
                        this.deleteAt(key, i);
                    }
                }
            }
        }
    };

    return Persistence;

})();