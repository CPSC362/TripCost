var DEBUG = true;

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

function simpleHandlebarsCompiler(templateSelector, data, outputSelector) {
    var template = Handlebars.compile($(templateSelector).html());

    $(outputSelector).html(template(data));
};

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

        var selectMenu = $('#directions-form select[name="vehicle"]');
        var listMenu = $('#nav-vehicle-list');

        var edmunds = new EDMUNDSAPI('qgtgm3apuq3fjkbfnzmmksnt');

        var fuelEconomy = new FuelEconomy(jQuery, edmunds);
        fuelEconomy.setSpinner('.add-vehicle-spinner');

        fuelEconomy.menus.year = $('select#add-vehicle-year');
        fuelEconomy.menus.make = $('select#add-vehicle-make');
        fuelEconomy.menus.model = $('select#add-vehicle-model');
        fuelEconomy.menus.options = $('select#add-vehicle-options');

        tripCost.addVehicleMenuListener(function(vehicles) {
            DEBUG && console.log("Erasing all vehicle menu options");

            // Select menu listener (used for choosing vehicle in distance calculation)
            selectMenu.find('option:not(:eq(0))').remove();

            DEBUG && console.log("Adding vehicles to select menu: ", vehicles);

            $.each(vehicles, function(index, vehicle) {
                selectMenu.append($("<option></option>").attr("value", vehicle.vehicleId).text(vehicle.name()));
            });

            // List of available vehicles in navigation bar
            simpleHandlebarsCompiler('#vehicle-list-template', {
                vehicles: vehicles
            }, listMenu);
        });


        tripCost.addDeleteVehicleMenuListener(function(vehicle) {
            DEBUG && console.log("Deleting vehicle: ", vehicle);

            selectMenu.find('option[value=' + vehicle.vehicleId + ']').remove();

            DEBUG && console.log("Remaining vehicles: ", tripCost.vehicles);

            simpleHandlebarsCompiler('#vehicle-list-template', {
                vehicles: tripCost.vehicles
            }, listMenu);
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

        if (tripCost.vehicles.length == 0) {
            simpleHandlebarsCompiler('#vehicle-list-template', {
                vehicles: []
            }, listMenu);
        }

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

                    var epaCost = (distanceInMiles / tripCost.vehicle.epaCombinedMpg) * gasPrice;
                    var egeCost = (distanceInMiles / tripCost.vehicle.egeCombinedMpg) * gasPrice;

                    // Assign a default in case the vehicle's range is 0
                    var maxRange = tripCost.vehicle.maxRange(true) || 482803.0;

                    markerGenerator.routeHandler(trip, maxRange);

                    console.log("Vehicle for route: ", tripCost.vehicle);

                    simpleHandlebarsCompiler('#results-template', {
                        epa: epaCost,
                        ege: egeCost,
                        mainImage: tripCost.vehicle.mainImage,
                        name: tripCost.vehicle.name
                    }, '#results-container');
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

            fuelEconomy.showVehiclePreview(Vehicle, function(data) {
                simpleHandlebarsCompiler('#vehicle-preview-template', data, 'div.add-vehicle-preview div.image-thumbnail');
            })
        });

        $('#add-vehicle-save').click(function(e) {

            tripCost.vehicle = new Vehicle(fuelEconomy.getVehicleMetadata());

            tripCost.vehicle.assembleVehicle(edmunds, function(vehicle) {

                fuelEconomy.saveVehicle(vehicle, function() {

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

        $('#nav-vehicle-list a').click(function(e) {
            e.preventDefault();

            console.log("Clicked: ", $(e.target));

            var vehicleId = $(e.target).parents('li').attr('data-vehicle-id');

            if ($(e.target).hasClass('close') || $(e.target).parent().hasClass('close')) {
                DEBUG && console.log('Deleting vehicle ' + vehicleId + '...');

                if (confirm('Are you sure you wish to delete the vehicle?')) {

                    tripCost.deleteVehicle(vehicleId, function(vehicle) {

                        // Delete from persistence
                        persistentStorage.searchAndDelete('vehicles', function(vehicle) {
                            // Test if the persisted object's vehicleId is the same as the target vehicleId
                            return (parseInt(vehicle.vehicleId) == parseInt(vehicleId));
                        });

                        if (tripCost.isActiveVehicle(vehicle)) {

                            // Vehicle is set as the active vehicle
                            tripCost.vehicle = null;

                            if (tripCost.routed) {

                                // Clear the map markers off the display
                                markerGenerator.clearMarkers();

                                // Clear the directions off the display
                                tripCost.directionsDisplay.setMap(null);

                                // Re-initialize the directions display
                                tripCost.directionsDisplay = new google.maps.DirectionsRenderer();

                                // Erase results
                                $('#results-container').html('');
                            }
                        }
                    });
                }
            } else {
                DEBUG && console.log('Editing vehicle ' + vehicleId + '...');
            }
        });
    }
});