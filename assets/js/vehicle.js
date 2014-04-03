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

        this.mainImage = null;

        this.defaultStopBeforeEmptyTankMeters = 32186.9;
        this.defaultStopBeforeEmptyTankMiles = 20.0;

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

        maxRange: function(meters, stopPriorToEmptyTank) {

            if (meters) {
                stopPriorToEmptyTank = (typeof stopPriorToEmptyTank === 'undefined') ? this.defaultStopBeforeEmptyTankMeters : stopPriorToEmptyTank;
                return this.epaCombinedMpg * this.fuelCapacity * 1609.34 - stopPriorToEmptyTank;
            } else {
                stopPriorToEmptyTank = (typeof stopPriorToEmptyTank === 'undefined') ? this.defaultStopBeforeEmptyTankMiles : stopPriorToEmptyTank;
                return this.epaCombinedMpg * this.fuelCapacity - stopPriorToEmptyTank;
            }
        },

        delete: function() {

        },

        assembleVehicle: function(edmundsAPI, callbackWhenFinished) {

            var self = this;

            var specificationOptions = {
                equipmentType: 'OTHER',
                name: 'Specifications'
            };

            var mediaOptions = {
                styleId: this.vehicleId
            };

            // Nested asynchronous calls. Possible improvement using deferred objects
            edmundsAPI.api('/api/vehicle/v2/styles/' + this.vehicleId + '/equipment', specificationOptions, function(vehicleInformationResponse) {

                var responseAttributes = vehicleInformationResponse.equipment[0].attributes;
                console.log(vehicleInformationResponse, responseAttributes);

                self.egeHighwayMpg = parseFloat(self._searchAttributes(responseAttributes, "Ege Highway Mpg", 0));
                self.egeCityMpg = parseFloat(self._searchAttributes(responseAttributes, "Ege City Mpg", 9));
                self.egeCombinedMpg = parseFloat(self._searchAttributes(responseAttributes, "Ege Combined Mpg", 6));

                self.epaHighwayMpg = parseFloat(self._searchAttributes(responseAttributes, "Epa Highway Mpg", 7));
                self.epaCityMpg = parseFloat(self._searchAttributes(responseAttributes, "Epa City Mpg", 2));
                self.epaCombinedMpg = parseFloat(self._searchAttributes(responseAttributes, "Epa Combined Mpg", 1));

                self.fuelCapacity = parseFloat(self._searchAttributes(responseAttributes, "Fuel Capacity", 8));


                // Note: v1
                edmundsAPI.api('/v1/api/vehiclephoto/service/findphotosbystyleid', mediaOptions, function(vehicleMediaInformationResponse) {

                    var baseUrl = 'http://media.ed.edmunds-media.com';

                    for (var i = 0, s = vehicleMediaInformationResponse.length; i < s; ++i) {
                        if (vehicleMediaInformationResponse[i].subType == 'exterior' &&
                            vehicleMediaInformationResponse[i].shotTypeAbbreviation == 'FQ') {

                            self.mainImage = baseUrl + self.optimalImageSrc(vehicleMediaInformationResponse[i].photoSrcs, 'lg');
                        }
                    }

                    console.log("Done with 2 async calls...");

                    callbackWhenFinished(self);
                });
            });

        },

        optimalImageSrc: function(photoSrcs, size) {

            console.log(photoSrcs);

            size = (size != undefined) ? size : 'md';

            var numSize;

            if (size == 'lg') {
                numSize = '500';
            } else if (size == 'md') {
                numSize = '400';
            } else if (size == 'sm') {
                numSize = '276';
            } else if (size == 'th') {
                numSize = '131';
            }

            for (var i = 0, s = photoSrcs.length; i < s; ++i) {
                if (photoSrcs[i].indexOf('_' + numSize + '.jpg') != -1) {
                    console.log("Found photo size (" + size + "): " + numSize, photoSrcs[i]);
                    return photoSrcs[i];
                }
            }

            return photoSrcs[0];
        },

        _searchAttributes: function(attributes, key, hint) {

            if (attributes[hint].name == key) {
                return attributes[hint].value;
            } else {
                for (var i = 0, s = attributes.length; i < s; ++i) {
                    if (attributes[i].name == key) {
                        return attributes[i].value;
                    }
                }

                return null;
            }
        }
    };

    return Vehicle;

})();