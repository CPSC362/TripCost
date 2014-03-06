// function:
(function() {
    var tripCostObject;

    module("Trip Cost", {
        setup: function() {
            tripCostObject = new TripCost('dummy-dom', google);
        },

        teardown: function() {

        }
    });

    asyncTest("returns trip information from python server", function() {

        // tripCostObject.get
        equal(1, 0, "test");
        start();
    });
})();