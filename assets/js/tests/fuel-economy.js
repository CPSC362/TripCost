// function:
(function() {
    var fuelEconomyObject;
    var vehicleObject;

    module("Fuel Economy", {
        setup: function() {
            vehicleObject = new Vehicle();
            fuelEconomyObject = new FuelEconomy(vehicleObject, jQuery);
        },

        teardown: function() {

        }
    });

    asyncTest("returns vehicle year menu", function() {

        fuelEconomyObject.getVehicleMenuYear(function(vehicles, textStatus) {
            equal(textStatus, "success", "Should receive an HTTP OK response");

            strictEqual(vehicles.hasOwnProperty('menuItem'), true, "Vehicles object has a menuItem property");
            strictEqual($.type(vehicles.menuItem), "array", "Vehicles object has a menuItem property of type \"array\"");

            for (var i = 0, s = vehicles.menuItem.length; i < s; ++i) {
                equal(vehicles.menuItem[i].text, vehicles.menuItem[i].value, "(" + vehicles.menuItem[i].text + ") text should equal array value (" + vehicles.menuItem[i].value + ")");
            }

            start();
        });
    });
})();