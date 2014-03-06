// function:
(function() {
    var tripCostObject;
    var vehicle;
    var directionsRequest;
    // Expecting googleDirectionsService global

    module("Trip Cost", {
        setup: function() {
            vehicle = new Vehicle({
                year: 2006,
                make: "Scion",
                model: "tC",
                vehicleId: "21775"
            });

            tripCostObject = new TripCost('dummy-dom', google);

            directionsRequest = {
                origin: "Los Angeles, CA",
                destination: "Chicago, IL",
                travelMode: google.maps.TravelMode.DRIVING
            };

        },

        teardown: function() {

        }
    });

    asyncTest("getTripInformation returns trip information from python server", function() {

        throws(tripCostObject.getTripInformation, "Method must have the params object defined");

        throws(function() {
            tripCostObject.getTripInformation({
                directions: null
            });
        }, "Params object must have vehicle defined");

        throws(function() {
            tripCostObject.getTripInformation({
                vehicle: null
            });
        }, "Params object must have directions defined");

        console.log(googleDirectionsService);

        googleDirectionsService.route(directionsRequest, function(result, status) {

            throws(function() {
                tripCostObject.getTripInformation({
                    vehicle: vehicle,
                    destination: result
                });
            }, "jQuery must be provided to the method");

            tripCostObject.getTripInformation({
                vehicle: vehicle,
                destination: result
            }, jQuery);

            start();
        });
    });
})();