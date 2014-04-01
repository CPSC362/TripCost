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
    function GasFeed(jQuery) {

        this.$ = jQuery;

        this.apiKey = 'ka89irk0fm' || 'rfej9napna';

        this.mode = 'production';

        this.baseUrl = (this.mode == 'development') ? 'http://devapi.mygasfeed.com/' : 'http://api.mygasfeed.com/';

    };

    GasFeed.prototype = {

        getStations: function(options, callbackWhenFinished) {
            if (typeof options.distance == "undefined") options.distance = 5;
            if (typeof options.fuelType == "undefined") options.fuelType = 'reg';
            if (typeof options.sortBy == "undefined") options.sortBy = 'price';

            var self = this;

            this.$.ajax({
                url: this.baseUrl + 'stations/radius/' + [options.latitude, options.longitude, options.distance, options.fuelType, options.sortBy, this.apiKey].join('/') + '.json',
                jsonp: 'callback',
                dataType: 'jsonp',
                success: function(response, textStatus) {
                    callbackWhenFinished(self.parseStations(response.stations));
                },
                error: function(response, textStatus) {
                    alert('Error receiving information from gas station API');
                }
            });
        },

        parseStations: function(stations) {

            var parsedStations = [];

            for (var i = 0, s = stations.length; i < s; ++i) {
                if (stations[i].price != 'N/A' && parsedStations.length <= MAX_GAS_STATIONS) {
                    parsedStations.push(stations[i]);
                }

                if (parsedStations.length == MAX_GAS_STATIONS) break;
            }

            return parsedStations;
        }
    };

    return GasFeed;

})();