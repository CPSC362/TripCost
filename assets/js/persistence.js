/*
|--------------------------------------------------------------------------
| Persistence
|--------------------------------------------------------------------------
|
| Created by Austin White <austinw@csu.fullerton.edu>
| California State University, Fullerton CPSC 362
| February 26, 2014
| 
| 
|
*/
var Persistence = (function(){

    // Constructor method
    function Persistence(storageInterface) {
    	this.adapter = storageInterface;
    };

    Persistence.prototype.get = function(key) {
    	var item = JSON.parse(this.adapter.getItem(key));

    	if ( ! item) return null;

    	if (item.timestamp < 0 || new Date().getTime() < item.timestamp) {
    		return JSON.parse(item.value);
    	} else {
    		return this.delete(key);
    	}
    };

    Persistence.prototype.set = function(key, value, expiration) {
    	
    	var expiration = (expiration) ? expiration * 60 * 1000 : -1;
    	
    	var item = {
    		value: JSON.stringify(value),
    		timestamp: (expiration > 0) ? new Date().getTime() + expiration : expiration
    	};

    	this.adapter.setItem(key, JSON.stringify(item));
    };

    Persistence.prototype.delete = function(key) {
    	this.adapter.removeItem(key);
    	return null;
    };

    Persistence.prototype.pushItem = function(key, value, expiration) {
    	
    	var item = this.get(key) || [];

        DEBUG && console.log(value);

    	if (item != null && item instanceof Array) {
    		item.push(value);
    		this.set(key, item, expiration);
    	} 
    };

    Persistence.prototype.deleteAt = function(key, index) {
    	
    	var item = this.get(key);

    	if (item != null && item instanceof Array) {
    		if ( ~ item.indexOf(index)) item.splice(index, 1);
    	}
    };

    return Persistence;

})();