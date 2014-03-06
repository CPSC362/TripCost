module("Vehicle Tests", {
	setup: function() {

	},

	teardown: function() {

	}
});

test("returns the name of the vehicle", function() {
	var v = new Vehicle();

	equal(v.name(), "", "Uninitialized vehicle has an empty string name");

	v = new Vehicle({
		year: "2006",
		make: "Scion",
		model: "tC",
		id: "00000"
	});

	equal(v.name(), "2006 Scion tC", "Initialized vehicle generates proper name.");

	v = new Vehicle({
		year: "2006",
		make: "Scion",
		model: ""
	});

	equal(v.name(), "", "Partial initialized vehicle generates no name");
});

test("returns the correct mpg for a vehicle", function() {
	// Test vehicle mpg data

});