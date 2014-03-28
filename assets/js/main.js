var DEBUG = false;

$.fn.serializeObject = function() {
    var e = {};
    var t = this.serializeArray();
    $.each(t, function() {
        if (e[this.name]) {
            if (!e[this.name].push) {
                e[this.name] = [e[this.name]]
            }
            e[this.name].push(this.value || "")
        } else {
            e[this.name] = this.value || ""
        }
    });
    return e
}

Handlebars.registerHelper("formatMoney", function(number) {
    var decimalPlaces = isNaN(decimalPlaces = Math.abs(decimalPlaces)) ? 2 : decimalPlaces,
        decimalSeparator = decimalSeparator == undefined ? "." : decimalSeparator,
        commaSeparator = commaSeparator == undefined ? "," : commaSeparator,
        sign = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(decimalPlaces)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + commaSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + commaSeparator) + (decimalPlaces ? decimalSeparator + Math.abs(number - i).toFixed(decimalPlaces).slice(2) : "");
});

$(function() {
    $('.dropdown-menu form').click(function(e) {
        e.stopPropagation();
    });

    if ($('#map-canvas').length) {
        if (!google) {
            alert('Could not load Google Maps. Exiting...');
            return;
        }

        var markerGenerator;

        // Main objects and services
        var tripCost = new TripCost('map-canvas', google);
        tripCost.initialize(function() {

            // after initialization...
            markerGenerator = new MarkerGenerator(google, tripCost.map);
        });
        tripCost.setSpinner($('.directions-spinner'));
        tripCost.addVehicleMenu($('#directions-form select[name="vehicle"]'));

        var edmunds = new EDMUNDSAPI('qgtgm3apuq3fjkbfnzmmksnt');

        var fuelEconomy = new FuelEconomy(jQuery, edmunds);
        fuelEconomy.setSpinner('.add-vehicle-spinner');

        fuelEconomy.menus.year = $('select#add-vehicle-year');
        fuelEconomy.menus.make = $('select#add-vehicle-make');
        fuelEconomy.menus.model = $('select#add-vehicle-model');
        fuelEconomy.menus.options = $('select#add-vehicle-options');

        tripCost.addVehicleMenuListener(function(selectMenus, vehicles) {
            $.each(selectMenus, function(index, selectMenu) {
                DEBUG && console.log("Erasing all vehicle menu options");

                selectMenu.find('option:not(:eq(0))').remove();

                DEBUG && console.log("Adding vehicles to select menu: ", vehicles);

                $.each(vehicles, function(index, vehicle) {
                    selectMenu.append($("<option></option>").attr("value", vehicle.vehicleId).text(vehicle.name()));
                });
            });
        });

        // Persistent storage.
        // Can swap out for localStorage, cookie, or server interface
        // Just need to implement methods set(), get(), and delete()
        var persistentStorage = new Persistence(localStorage);

        var directionsForm = {
            start: $('#directions-form input[name="start"]'),
            startError: $('#directions-form .start-error'),
            destination: $('#directions-form input[name="destination"]'),
            destinationError: $('#directions-form .destination-error'),
            vehicle: $('#directions-form select[name="vehicle"]'),
            vehicleError: $('#directions-form .vehicle-select-error'),
            routeError: $('#directions-form .route-error')
        }

        directionsForm.start.on('keyup', function(e) {
            directionsForm.startError.html('');
        });
        directionsForm.destination.on('keyup', function(e) {
            directionsForm.destinationError.html('');
        });
        directionsForm.vehicle.on('change', function(e) {
            directionsForm.vehicleError.html('');
        });

        // Load vehicles
        tripCost.loadVehicles(persistentStorage.get('vehicles'));

        $('#findRoute').click(function(e) {
            e.preventDefault();

            // Validation
            var problem = false;

            if (directionsForm.vehicle.find(':selected').val() == '') {
                directionsForm.vehicleError.html('Please select a vehicle first');
                problem = true;
            }

            if (directionsForm.start.val() == '') {
                directionsForm.startError.html('Please enter a starting point');
                problem = true;
            }

            if (directionsForm.destination.val() == '') {
                directionsForm.destinationError.html('Please enter destination');
                problem = true;
            }

            if (problem) return;

            // Assign vehicle to trip
            tripCost.vehicle = tripCost.findVehicle(directionsForm.vehicle.find(':selected').val());

            tripCost.getDirections($('#start').val(), $('#destination').val(), {
                success: function(trip) {

                    // Clear any lasting validation errors
                    directionsForm.routeError.html('');

                    // Show results interface button
                    $('#results-button').fadeIn();

                    // Close all active menus
                    closeMenus();

                    var distance = 0;

                    var gasPrice = 3.90;

                    console.log(trip);

                    for (var i = 0, s = trip.routes.length; i < s; ++i) {
                        for (var j = 0, t = trip.routes[i].legs.length; j < t; ++j) {
                            distance += trip.routes[i].legs[j].distance.value;
                        }
                    }

                    distanceInMiles = distance * 0.000621371;

                    var epaCost = (distance / tripCost.vehicle.epaCombinedMpg) * gasPrice;
                    var egeCost = (distance / tripCost.vehicle.egeCombinedMpg) * gasPrice;

                    // Assign a default in case the vehicle's range is 0
                    var maxRange = tripCost.vehicle.maxRange(true) || 300.0;

                    markerGenerator.routeHandler(trip, maxRange);

                    var template = Handlebars.compile($('#results-template').html());

                    $('#results').html(template({
                        epa: epaCost,
                        ege: egeCost
                    }));
                },
                error: function(result, status) {
                    directionsForm.routeError.html(tripCost.errorMessage(status));
                }
            });
        });

        function closeMenus() {
            $('[data-toggle="dropdown"]').parent().removeClass('open');
            if (!$('.navbar-toggle').hasClass('collapsed')) {
                $('.navbar-toggle').click();
            }
        }

        $('#add-vehicle-modal').on('show.bs.modal', function(e) {
            fuelEconomy.vehicleYearMenu();
        });

        $('select#add-vehicle-year').change(function(e) {
            fuelEconomy.setVehicleMetadata('year', $(e.target).val());
            fuelEconomy.vehicleMakeMenu();
        });

        $('select#add-vehicle-make').change(function(e) {
            fuelEconomy.setVehicleMetadata('make', $(e.target).val());
            fuelEconomy.setVehicleMetadata('makeFriendlyName', $(e.target).find('option:selected').text());
            fuelEconomy.vehicleModelMenu();
        });

        $('select#add-vehicle-model').change(function(e) {
            fuelEconomy.setVehicleMetadata('model', $(e.target).val());
            fuelEconomy.setVehicleMetadata('modelFriendlyName', $(e.target).find('option:selected').text());
            fuelEconomy.vehicleOptionsMenu();
        });

        $('select#add-vehicle-options').change(function(e) {
            fuelEconomy.setVehicleMetadata('vehicleId', $(e.target).val());
        });

        $('#add-vehicle-save').click(function(e) {

            fuelEconomy.assembleVehicle(function() {

                fuelEconomy.saveVehicle('form#add-vehicle', function(vehicle) {

                    $('#add-vehicle-modal').modal('hide');

                    tripCost.addVehicle(vehicle);

                    persistentStorage.pushItem('vehicles', vehicle);
                });
            });
        });

        $('#add-vehicle-reset').click(function(e) {
            fuelEconomy.reset('form#add-vehicle');
        });

        $('a[href="#results-container"]').click(function(e) {
            e.preventDefault();

            closeMenus();

            $('html, body').animate({
                scrollTop: $("#results-container").offset().top
            }, 500);
        });

        $('a[href="#top"]').click(function(e) {
            e.preventDefault();

            closeMenus();

            $('html, body').animate({
                scrollTop: $("html").top
            }, 500);
        });

        document.body.addEventListener('vehicle-added', function(event) {
            var vehicle = event.detail.vehicle;

            $('#directions-form select[name="vehicle"]').append('<option value="' + vehicle.vehicleId + '">' + vehicle.name() + '</option>');

            console.log("Adding vehicle: ", vehicle);
        }, false);
    }

});