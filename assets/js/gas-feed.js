/*
|--------------------------------------------------------------------------
| GasFeed
|--------------------------------------------------------------------------
|
| Created by Austin White <austinw@csu.fullerton.edu>
| California State University, Fullerton CPSC 362
| April 1, 2014
|
*/
var GasFeed = (function() {

    var MAX_GAS_STATIONS = 5;

    // Constructor method
    function GasFeed(jQuery, momentJS) {

        // jQuery dependency for ajax (could be removed)
        this.$ = jQuery;

        // MomentJS dependency for applying a threshold for gas station price updates
        this.moment = momentJS;

        // Changing modes will change the baseUrl
        this.mode = 'production';

        if (this.mode == 'production') {
            // mygasfeed.com API key
            this.apiKey = 'ka89irk0fm';
            this.baseUrl = 'http://api.mygasfeed.com/';
        } else {
            this.apiKey = 'rfej9napna';
            this.baseUrl = 'http://devapi.mygasfeed.com/';
        }

        // Gas station price update threshold
        this.mustBeUpdatedSoonerThan = this.moment().subtract('weeks', 2).unix();

    };

    GasFeed.prototype = {

        getStations: function(options, callbackWhenFinished) {
            if (typeof options.distance == "undefined") options.distance = 5;
            if (typeof options.fuelType == "undefined") options.fuelType = 'reg';
            if (typeof options.sortBy == "undefined") options.sortBy = 'price';

            var self = this;

            return this.$.ajax({
                url: this.baseUrl + 'stations/radius/' + [options.latitude, options.longitude, options.distance, options.fuelType, options.sortBy, this.apiKey].join('/') + '.json',
                jsonp: 'callback',
                dataType: 'jsonp'
            });
        },

        parseStations: function(stations) {

            var parsedStations = [];

            for (var i = 0, s = stations.length; i < s; ++i) {
                if (stations[i].price != 'N/A' && parsedStations.length <= MAX_GAS_STATIONS) {
                    var lastUpdated = this.moment.parseHumanized(stations[i].date).unix();
                    var now = this.moment().unix();

                    if (lastUpdated > this.mustBeUpdatedSoonerThan) {
                        parsedStations.push(stations[i]);
                    }
                }

                if (parsedStations.length == MAX_GAS_STATIONS) break;
            }

            return parsedStations;
        },

        cheapestGas: function(stations) {

            console.log("Cheapest gas stations: ", stations);

            if (stations.length === 0) return null;

            var cheapest = parseFloat(stations[0].price);
            console.log("First station: ", cheapest);

            for (var i = 1, s = stations.length; i < s; ++i) {
                var price = parseFloat(stations[i].price);
                if (price < cheapest) cheapest = price;
            }

            return cheapest;
        }
    };

    return GasFeed;

})();