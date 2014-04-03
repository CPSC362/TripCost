var MarkerGenerator = (function() {

    function MarkerGenerator(_google, _map) {

        // Dependency: Google Maps API
        this.googleProvider = _google;

        // Dependency: Map object
        this.map = _map;

        this.maxDistance = 0;

        this.mapMarkers = [];

        this.gasStations = [];

        this.icons = new Array();

        // this.icons["green"] = new this.googleProvider.maps.MarkerImage('/assets/img/green-marker.png',
        //     new this.googleProvider.maps.Size(40, 64),

        //     new this.googleProvider.maps.Point(0, 0),

        //     new this.googleProvider.maps.Point(10, 32),

        //     new this.googleProvider.maps.Size(20, 32)
        // );

        this.icons["magenta"] = new this.googleProvider.maps.MarkerImage('/assets/img/magenta-marker.png',
            new this.googleProvider.maps.Size(40, 64),

            new this.googleProvider.maps.Point(0, 0),

            new this.googleProvider.maps.Point(10, 32),

            new this.googleProvider.maps.Size(20, 32)
        );

        this.icons["yellow"] = new this.googleProvider.maps.MarkerImage('/assets/img/yellow-marker.png',
            new this.googleProvider.maps.Size(40, 64),

            new this.googleProvider.maps.Point(0, 0),

            new this.googleProvider.maps.Point(10, 32),

            new this.googleProvider.maps.Size(20, 32)
        );



        this.iconShape = {
            coord: [9, 0, 6, 1, 4, 2, 2, 4, 0, 8, 0, 12, 1, 14, 2, 16, 5, 19, 7, 23, 8, 26, 9, 30, 9, 34, 11, 34, 11, 30, 12, 26, 13, 24, 14, 21, 16, 18, 18, 16, 20, 12, 20, 8, 18, 4, 16, 2, 15, 1, 13, 0],
            type: 'poly'
        };

        this.infoWindow = new this.googleProvider.maps.InfoWindow({
            size: new this.googleProvider.maps.Size(150, 50),
            // Custom image is misaligning the InfoWindow. This fixes the positioning
            pixelOffset: new this.googleProvider.maps.Size(-10, 0)
        });

    };

    MarkerGenerator.prototype = {

        routeHandler: function(directions, maxVehicleDistance, callbackForAllMarkers) {

            // Get the primary route from the directions object
            var route = directions.routes[0];

            // Get the map bounds
            var bounds = new this.googleProvider.maps.LatLngBounds();

            var markers = [];

            startLocation = new Object();
            endLocation = new Object();

            // Create an invisible polyline that will follow the path of the directions
            var polyline = new this.googleProvider.maps.Polyline({
                path: [],
                strokeColor: '#FF0000',
                strokeWeight: 2
            });

            var legs = route.legs;

            for (var i = 0, s = legs.length; i < s; ++i) {

                // For each leg of the trip, we need the start and end to calculate the distance
                startLocation.latlng = legs[i].start_location;
                startLocation.address = legs[i].start_address;

                endLocation.latlng = legs[i].end_location;
                endLocation.address = legs[i].end_address;

                var steps = legs[i].steps;

                for (var j = 0, t = steps.length; j < t; ++j) {

                    // Get the path of the next segment
                    var nextSegment = steps[j].path;

                    for (var k = 0, u = nextSegment.length; k < u; ++k) {
                        // Push all of the paths onto the polyline
                        polyline.getPath().push(nextSegment[k]);
                    }
                }
            }

            var totalPoints = Math.floor(polyline.Distance() / maxVehicleDistance);

            for (var distanceIndex = 0, i = 0; distanceIndex < polyline.Distance(); distanceIndex += maxVehicleDistance, i++) {

                DEBUG && console.log("Point at distance: ", polyline.GetPointAtDistance(distanceIndex));

                if (distanceIndex != 0) {
                    // Use the epolys.js library to get a Google Maps point at the specified distance
                    var point = polyline.GetPointAtDistance(distanceIndex);

                    // Use the distance in miles as the label of the marker
                    var description = this.formatNumber(this.metersToMiles(distanceIndex)) + " mi";

                    // Create a magenta colored Google Maps marker for the point
                    var marker = this.createMarker(point, description, point.toString(), "magenta");

                    // Push the marker to an array to pass to the finished callback
                    markers.push(marker);
                }
            }

            if (typeof callbackForAllMarkers === "function") {
                callbackForAllMarkers(markers);
            }
        },

        gasStationHandler: function(stations) {

            var point;

            // Loop through each of the gas stations
            for (var i = 0, s = stations.length; i < s; ++i) {

                // Generate a Google Maps point based on the station's latitude and longitude
                point = new this.googleProvider.maps.LatLng(parseFloat(stations[i].lat), parseFloat(stations[i].lng));

                var label = stations[i].station + ' - $' + stations[i].price;

                var description = stations[i].address + '<br />' + stations[i].city + ', ' + stations[i].region + ' ' + stations[i].zip;

                // Create the marker for the gas station
                this.createMarker(point, label, description, "yellow");
            }
        },

        getMarkerImage: function(iconColor) {

            iconColor = (iconColor == undefined) ? "magenta" : iconColor;

            if (!this.icons[iconColor]) {
                this.icons[iconColor] = new this.googleProvider.maps.MarkerImage("/assets/img/marker_" + iconColor + ".png",
                    // This marker is 20 pixels wide by 34 pixels tall.
                    new this.googleProvider.maps.Size(20, 34),
                    // The origin for this image is 0,0.
                    new this.googleProvider.maps.Point(0, 0),
                    // The anchor for this image is at 6,20.
                    new this.googleProvider.maps.Point(9, 34)
                );
            }

            return this.icons[iconColor];
        },

        createMarker: function(latLng, label, html, color) {

            var self = this;

            // Possibly use handlebars templating
            var contentString = '<b>' + label + '</b><br>' + html;

            var marker = new this.googleProvider.maps.Marker({
                position: latLng,
                // draggable: true,
                map: this.map,
                shadow: this.iconShadow,
                icon: this.getMarkerImage(color),
                shape: this.iconShape,
                title: label,
                zIndex: Math.round(latLng.lat() * -100000) << 5,
                animation: this.googleProvider.maps.Animation.DROP
            });

            // Set the label
            marker.myname = label;

            // Add the marker to an array so it can be cleared
            this.mapMarkers.push(marker);

            // Set a click responder for each of the markers to open their info window
            this.googleProvider.maps.event.addListener(marker, 'click', function() {
                self.infoWindow.setContent(contentString);
                self.infoWindow.open(self.map, marker);
            });

            return marker;
        },

        clearMarkers: function() {

            var marker = this.mapMarkers.pop();

            while (marker != undefined) {
                DEBUG && console.log("Clearing marker...");
                marker.setMap(null);
                marker = this.mapMarkers.pop();
            }

        },

        formatNumber: function(number) {
            var decimalPlaces = isNaN(decimalPlaces = Math.abs(decimalPlaces)) ? 2 : decimalPlaces,
                decimalSeparator = decimalSeparator == undefined ? "." : decimalSeparator,
                commaSeparator = commaSeparator == undefined ? "," : commaSeparator,
                sign = number < 0 ? "-" : "",
                i = parseInt(number = Math.abs(+number || 0).toFixed(decimalPlaces)) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            return sign + (j ? i.substr(0, j) + commaSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + commaSeparator) + (decimalPlaces ? decimalSeparator + Math.abs(number - i).toFixed(decimalPlaces).slice(2) : "");
        },

        metersToMiles: function(meters) {
            return meters * 0.000621371;
        }
    };

    return MarkerGenerator;

})();