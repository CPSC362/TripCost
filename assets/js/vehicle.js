// function:
var Vehicle = (function() {

    function Vehicle(attrs) {

        this.year = (attrs) ? attrs.year : "";
        this.make = (attrs) ? attrs.make : "";
        this.makeFriendlyName = (attrs) ? attrs.makeFriendlyName : "";
        this.model = (attrs) ? attrs.model : "";
        this.modelFriendlyName = (attrs) ? attrs.modelFriendlyName : "";
        this.vehicleId = (attrs) ? attrs.vehicleId : null;

        this.egeHighwayMpg = 0;
        this.egeCityMpg = 0;
        this.egeCombinedMpg = 0;

        this.epaHighwayMpg = 0;
        this.epaCityMpg = 0;
        this.epaCombinedMpg = 0;

        this.fuelCapacity = 0;

    };

    Vehicle.prototype = {
        restore: function(objectAttributes) {
            for (var property in objectAttributes) {
                if (this.hasOwnProperty(property)) {
                    this[property] = objectAttributes[property];
                }
            }
        },

        name: function() {

            if (this.makeFriendlyName && this.modelFriendlyName && this.year) {
                return this.year + ' ' + this.makeFriendlyName + ' ' + this.modelFriendlyName;
            } else if (this.year && this.make && this.model) {
                return this.year + ' ' + this.make + ' ' + this.model;
            } else {
                return '';
            }

        },

        maxRange: function(meters) {
            if (meters) {
                return this.epaCombinedMpg * this.fuelCapacity * 1609.34;
            } else {
                return this.epaCombinedMpg * this.fuelCapacity;
            }
        },

        delete: function() {

        }
    };

    return Vehicle;

})();