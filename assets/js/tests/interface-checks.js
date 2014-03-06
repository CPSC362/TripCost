// Instance objects needed globally
var vehicleInstance = new Vehicle();

// Interfaces
var interfaces = [
    // Vehicle
    {
        interfaceSpecification: new Interface('Vehicle', ['name', 'mpg']),
        instance: vehicleInstance
    },
    // FuelEconomy
    {
        interfaceSpecification: new Interface('FuelEconomy', ['vehicleYearMenu', 'vehicleMakeMenu', 'vehicleModelMenu', 'vehicleOptionsMenu', 'saveVehicle', '_populateSelect', '_eraseSelection', '_loading', 'setSpinner', 'reset']),
        instance: new FuelEconomy(vehicleInstance, jQuery)
    },
    // TripCost
    {
        interfaceSpecification: new Interface('TripCost', ['initialize', 'getDirections', 'addVehicle', 'loadVehicles', 'loading', 'setSpinner', 'errorMessage', 'addVehicleMenu', 'addVehicleMenuListener', 'getTripInformation']),
        instance: new TripCost('main', google)
    },
    // Google
    {
        interfaceSpecification: new Interface('Google Maps', ['Map', 'LatLng', 'DirectionsService', 'DirectionsRenderer']),
        instance: google.maps
    },
    // Persistence
    {
        interfaceSpecification: new Interface('Persistence', ['get', 'set', 'delete', 'pushItem', 'deleteAt']),
        instance: new Persistence(localStorage)
    },
    // Local Storage
    {
        interfaceSpecification: new Interface('Local Storage', ['getItem', 'setItem', 'removeItem']),
        instance: localStorage
    }
];


var domElement = $('#main');
$.each(interfaces, function(index, interfaceToCheck) {

    var specification = interfaceToCheck.interfaceSpecification;
    var name = specification.name;
    var methods = specification.methods;

    try {
        Interface.ensureImplements(interfaceToCheck.instance, interfaceToCheck.interfaceSpecification);

        domElement.append('<h2 class="good">' + (index + 1) + '. ' + name + ' - Pass</h2>');
        domElement.append('<div class="alert alert-success">' + name + ' implements all ' + methods.length + ' method(s)</div>');
    } catch (error) {
        domElement.append('<h2 class="bad">' + (index + 1) + '. ' + interfaceToCheck.interfaceSpecification.name + ' - Fail</h2>');
        domElement.append('<div class="alert alert-danger">' + error.message + '</div>');
    }
});