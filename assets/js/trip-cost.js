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

var TripCost = (function() {

    // Constructor method
    function TripCost(domId, google) {

        this.domElement = document.getElementById(domId);

        this.googleProvider = google;

        this.directionsService = null;

        this.directionsDisplay = null;

        this.map = null;

        this.polyline = null;

        this.routed = false;

        this.trip = null;

        this.vehicle = null;

        this.vehicles = [];

        this._vehicleMenus = [];

        this._vehicleMenuListeners = new Array();

        this._deleteVehicleMenuListeners = new Array();

        this._spinner = null;
    };

    TripCost.prototype = {

        /*
        |--------------------------------------------------------------------------
        | Initialize the map
        |--------------------------------------------------------------------------
        |
        | Add a listener for the DOM 'load' event. When ready, load the map
        | and initialize the location to the CSUF campus.
        |
        */
        initialize: function(callbackWhenFinished) {

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

                callbackWhenFinished();
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Get directions for the user
        |--------------------------------------------------------------------------
        |
        | User can provide start and destination points and if valid locations,
        | Google Maps will return turn by turn directions and render on the map
        |
        */
        getDirections: function(start, destination, callbacks) {

            // Preserve reference to instance
            var self = this;

            this.directionsDisplay.setMap(this.map);

            this.loading(true);

            var request = {
                origin: start,
                destination: destination,
                travelMode: this.googleProvider.maps.TravelMode.DRIVING
            };

            this.directionsService.route(request, function(result, status) {

                self.loading(false);

                if (status == self.googleProvider.maps.DirectionsStatus.OK) {

                    // Output the result object for reference
                    DEBUG && console.log("Google Maps result: ", result);

                    self.directionsDisplay.setDirections(result);

                    // var summaryPanel = document.getElementById("directions_panel");
                    // directionsDisplay.setPanel(summaryPanel);

                    self.trip = result;
                    self.routed = true;

                    callbacks.success(self.trip);
                } else {
                    callbacks.error(result, status);
                }
            });
        },

        getTripInformation: function(params, jQuery) {

            if (params == null || !params.hasOwnProperty('vehicle') || !params.hasOwnProperty('directions')) {
                throw "getTripInformation() requires a parameter object with vehicle and directions properties";
            }

            if (!jQuery) {
                throw "getTripInformation() requires jQuery";
            }

            jQuery.ajax({
                url: '/vehicle-information',
                type: 'get',
                dataType: 'json',
                data: params,
                success: function(data, textStatus) {
                    console.log(data);
                }
            });
        },

        addVehicle: function(vehicle) {
            DEBUG && console.log("Adding vehicle: ", vehicle);
            this.vehicles.push(vehicle);

            if (this._vehicleMenuListeners.length) {
                for (var i = 0, s = this._vehicleMenuListeners.length; i < s; ++i) {
                    this._vehicleMenuListeners[i](this.vehicles);
                }
            }

            return this.vehicles.length;
        },

        findVehicle: function(vehicleId) {
            DEBUG && console.log("Finding vehicle: " + vehicleId);

            for (var i = 0, s = this.vehicles.length; i < s; ++i) {
                if (this.vehicles[i].vehicleId == vehicleId) {
                    return this.vehicles[i];
                }
            }

            return null;
        },

        loadVehicles: function(vehicles) {

            if (vehicles) {
                DEBUG && console.log("Loading " + vehicles.length + " vehicles from persistent storage: ", vehicles.length);
            }

            if (vehicles) {
                for (var i = 0; i < vehicles.length; ++i) {
                    var v = new Vehicle();

                    DEBUG && console.log("Vehicle from storage: ", vehicles[i]);
                    v.restore(vehicles[i]);

                    this.addVehicle(v);
                }
            }
        },

        loading: function(status) {
            if (status) {
                this._spinner.removeClass('fa-map-marker').addClass('fa-spinner fa-spin');
            } else {
                this._spinner.removeClass('fa-spinner fa-spin').addClass('fa-map-marker');
            }
        },

        setSpinner: function(spinnerElement) {
            this._spinner = spinnerElement;
        },

        errorMessage: function(status) {
            if (status == this.googleProvider.maps.DirectionsStatus.NOT_FOUND)
                return 'Invalid start or destination point';
            if (status == this.googleProvider.maps.DirectionsStatus.ZERO_RESULTS)
                return 'Route could not be found';
            if (status == this.googleProvider.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED)
                return 'Too many waypoints';
            if (status == this.googleProvider.maps.DirectionsStatus.INVALID_REQUEST)
                return 'Missing a start or destination';
            if (status == this.googleProvider.maps.DirectionsStatus.OVER_QUERY_LIMIT)
                return 'Too many Google Maps requests from TripCost';
            if (status == this.googleProvider.maps.DirectionsStatus.REQUEST_DENIED)
                return 'Problem accessing Google Maps';
            if (status == this.googleProvider.maps.DirectionsStatus.UNKNOWN_ERROR)
                return 'Unidentified Google Maps error';
        },

        addVehicleMenu: function(domSelectElement) {
            this._vehicleMenus.push(domSelectElement);
        },

        addVehicleMenuListener: function(callback) {
            this._vehicleMenuListeners.push(callback);
        },

        addDeleteVehicleMenuListener: function(callback) {
            this._deleteVehicleMenuListeners.push(callback);
        },

        deleteVehicle: function(vehicleId, callbackWhenDeleteFinished) {

            var theVehicle;

            for (var i = 0, s = this.vehicles.length; i < s; ++i) {
                if (this.vehicles[i].vehicleId == vehicleId) {
                    theVehicle = this.vehicles[i];
                    break;
                }
            }

            if ( !! theVehicle) {

                // Remove the vehicle from the array
                this.vehicles.splice(i, 1);

                for (var i = 0, s = this._deleteVehicleMenuListeners.length; i < s; ++i) {
                    console.log(theVehicle);
                    this._deleteVehicleMenuListeners[i](theVehicle);
                }

                callbackWhenDeleteFinished(theVehicle);

            }
        },

        getVehicleById: function(vehicleId) {

            for (var i = 0, s = this.vehicles.length; i < s; ++i) {
                if (this.vehicles[i].vehicleId == vehicleId) {
                    return this.vehicles[i];
                    break;
                }
            }

            return null;
        },

        isActiveVehicle: function(vehicle) {
            return (parseInt(this.vehicle.vehicleId) == parseInt(vehicle.vehicleId));
        },

        getMap: function() {
            return this.map;
        }
    };

    return TripCost;

})();