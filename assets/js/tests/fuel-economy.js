// function:
(function(){
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

	test("returns vehicle year menu", function() {
		stop();
		fuelEconomyObject.getVehicleMenuYear(function(vehicles, textStatus) {
			equal(textStatus, "success", "Should receive an HTTP OK response");
			
			for (var i = 0, s = vehicles.length; i < s; ++i) {
				equal(vehicles[i].text, vehicles[i].value, "Keys should equal array values");
			}

			start();
		});
	});
})();



