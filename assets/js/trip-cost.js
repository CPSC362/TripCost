/*
|--------------------------------------------------------------------------
| TripCost
|--------------------------------------------------------------------------
|
| Created by Austin White <austinw@csu.fullerton.edu>
| California State University, Fullerton CPSC 362
| February 21, 2014
| 
| This class is responsible for managing the map onscreen and retrieving
| information from Google Directions API.
|
| Dependency: (object) google "Google Maps API"
| Source: //maps.googleapis.com/maps/api/js?v=3&sensor=false&extension=.js
|
*/
var TripCost = (function(google){

    // Constructor method
    function TripCost(domId, google) {

        this.domElement = document.getElementById(domId);

        this.googleProvider = google;

        this.initialize();
    };

    /*
    |--------------------------------------------------------------------------
    | Initialize the map
    |--------------------------------------------------------------------------
    |
    | Add a listener for the DOM 'load' event. When ready, load the map
    | and initialize the location to the CSUF campus.
    |
    */
    TripCost.prototype.initialize = function() {

        // Preserve reference to instance
        var self = this;

        this.googleProvider.maps.event.addDomListener(window, 'load', function() {
            
            self.directionsService = new self.googleProvider.maps.DirectionsService();
            self.directionsDisplay = new self.googleProvider.maps.DirectionsRenderer();

            var calStateFullerton = new self.googleProvider.maps.LatLng(33.8596069, -117.8867514);

            // Initialize the map on the dom element to zoom level 15, centered
            // on CSUF, and display using the standard roadmap
            self.map = new self.googleProvider.maps.Map(self.domElement, {
                zoom: 15,
                center: calStateFullerton,
                mapTypeId: self.googleProvider.maps.MapTypeId.ROADMAP
            });
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Get directions for the user
    |--------------------------------------------------------------------------
    |
    | User can provide start and destination points and if valid locations,
    | Google Maps will return turn by turn directions and render on the map
    |
    */
    TripCost.prototype.getDirections = function(start, destination) {

        // Preserve reference to instance
        var self = this;
        
        this.directionsDisplay.setMap(this.map);
        
        var request = {
            origin: start,
            destination: destination,
            travelMode: this.googleProvider.maps.TravelMode.DRIVING
        };

        this.directionsService.route(request, function(result, status) {
            if (status == self.googleProvider.maps.DirectionsStatus.OK) {

                // Output the result object for reference
                console.log(result);

                self.directionsDisplay.setDirections(result);
            }
        });
    }

    return TripCost;

})(google);