var MarkerGenerator = (function() {

    function MarkerGenerator(_google, _map) {

        // Dependency: Google Maps API
        this.googleProvider = _google;

        // Dependency: Map object
        this.map = _map;

        this.maxDistance = 0;

        this.gMarkers = [];

        this.icons = new Array();

        this.icons["red"] = new this.googleProvider.maps.MarkerImage('/assets/img/marker_red.png',
            // This marker is 20 pixels wide by 34 pixels tall.
            new this.googleProvider.maps.Size(20, 34),
            // The origin for this image is 0,0.
            new this.googleProvider.maps.Point(0, 0),
            // The anchor for this image is at 9,34.
            new this.googleProvider.maps.Point(9, 34)
        );

        this.icons["green"] = new this.googleProvider.maps.MarkerImage('/assets/img/green-marker.png',
            new this.googleProvider.maps.Size(40, 64),

            new this.googleProvider.maps.Point(0, 0),

            new this.googleProvider.maps.Point(10, 32),

            new this.googleProvider.maps.Size(20, 32)
        );

        this.icons["magenta"] = new this.googleProvider.maps.MarkerImage('/assets/img/magenta-marker.png',
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
            size: new this.googleProvider.maps.Size(150, 50)
        });

    };

    MarkerGenerator.prototype = {

        routeHandler: function(directions, maxVehicleDistance) {

            // Get the primary route from the directions object
            var route = directions.routes[0];

            // Get the map bounds
            var bounds = new this.googleProvider.maps.LatLngBounds();

            startLocation = new Object();
            endLocation = new Object();

            var polyline = new this.googleProvider.maps.Polyline({
                path: [],
                strokeColor: '#FF0000',
                strokeWeight: 2
            });

            var legs = route.legs;

            for (var i = 0, s = legs.length; i < s; ++i) {

                startLocation.latlng = legs[i].start_location;
                startLocation.address = legs[i].start_address;
                // startLocation.marker = createMarker(legs[i].start_location,"start",legs[i].start_address,"green");

                endLocation.latlng = legs[i].end_location;
                endLocation.address = legs[i].end_address;

                var steps = legs[i].steps;

                // alert("processing " + steps.length + " steps");

                for (var j = 0, t = steps.length; j < t; ++j) {

                    var nextSegment = steps[j].path;

                    for (var k = 0, u = nextSegment.length; k < u; ++k) {
                        polyline.getPath().push(nextSegment[k]);
                        bounds.extend(nextSegment[k]);
                    }
                }
            }

            for (var i = 0; i < polyline.Distance(); i += maxVehicleDistance) {
                // TODO: Set to correct distance
                if (i != 0) this.createMarker(polyline.GetPointAtDistance(i), "200km", "200km", "magenta");
            }
        },

        getMarkerImage: function(iconColor) {

            iconColor = (iconColor == undefined) ? "red" : iconColor;

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
                zIndex: Math.round(latLng.lat() * -100000) << 5
            });

            marker.myname = label;
            this.gMarkers.push(marker);

            this.googleProvider.maps.event.addListener(marker, 'click', function() {
                this.infoWindow.setContent(contentString);
                this.infoWindow.open(this.map, marker);
            });

            return marker;
        },

        clearMarkers: function() {

            var marker = this.gMarkers.pop();

            while (marker != undefined) {
                console.log("Clearing marker...");
                marker.setMap(null);
                marker = this.gMarkers.pop();
            }

        }
    };

    return MarkerGenerator;

})();