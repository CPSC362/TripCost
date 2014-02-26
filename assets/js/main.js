$(function() {
    $('.dropdown-menu form').click(function(e) { e.stopPropagation(); });

    var tripCost = new TripCost('map-canvas', google);
    tripCost.setSpinner('.directions-spinner')
    var fuelEconomy = new FuelEconomy(jQuery);
    fuelEconomy.setSpinner('.add-vehicle-spinner');

    var directionsForm = {
        start: $('#directions-form input[name="start"]'),
        startError: $('#directions-form .start-error'),
        destination: $('#directions-form input[name="destination"]'),
        destinationError: $('#directions-form .destination-error'),
        vehicle: $('#directions-form select[name="vehicle"]'),
        vehicleError: $('#directions-form .vehicle-select-error'),
        routeError: $('#directions-form .route-error')
    }

    directionsForm.start.on('keyup',       function(e) {directionsForm.startError.html('');});
    directionsForm.destination.on('keyup', function(e) {directionsForm.destinationError.html('');});
    directionsForm.vehicle.on('change',     function(e) {directionsForm.vehicleError.html('');});

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

        tripCost.getDirections($('#start').val(), $('#destination').val(), {
            success: function(trip) {
                $('#results-button').fadeIn();

                console.log(fuelEconomy.vehicle);
            },
            error: function(result, status) {
                directionsForm.routeError.html(tripCost.errorMessage(status));
            }
        });
    });

    function closeMenus() {
        $('[data-toggle="dropdown"]').parent().removeClass('open');
        if ( ! $('.navbar-toggle').hasClass('collapsed')) {
            $('.navbar-toggle').click();
        }
    }

    $('#add-vehicle-modal').on('show.bs.modal', function (e) {
        fuelEconomy.vehicleYearMenu('select#add-vehicle-year');
    });

    $('select#add-vehicle-year').change(function(e) {
        fuelEconomy.vehicleMakeMenu($(e.target).val(), 'select#add-vehicle-make');
    });

    $('select#add-vehicle-make').change(function(e) {
        fuelEconomy.vehicleModelMenu($(e.target).val(), 'select#add-vehicle-model');
    });

    $('select#add-vehicle-model').change(function(e) {
        fuelEconomy.vehicleOptionsMenu($(e.target).val(), 'select#add-vehicle-options');
    });

    $('#add-vehicle-save').click(function(e) {
        fuelEconomy.loading(true);

        fuelEconomy.saveVehicle('form#add-vehicle', function() {
            fuelEconomy.loading(false);
            $('#add-vehicle-modal').modal('hide');

            $('body').trigger('vehicle-added', fuelEconomy.vehicle);
        });
    });

    $('#add-vehicle-reset').click(function(e) {
        fuelEconomy.reset('form#add-vehicle');
    });

    $('a[href="#results-container"]').click(function(e) {
        e.preventDefault();

        $('html, body').animate({
            scrollTop: $("#results-container").offset().top
        }, 500);
    });

    $('a[href="#"]').click(function(e) {
        e.preventDefault();

        $('html, body').animate({
            scrollTop: $("body").offset().top
        }, 500);
    });

    $('body').on('vehicle-added', function() {

        var vehicle = fuelEconomy.vehicle;
        tripCost.addVehicle(vehicle);

        $('#directions-form select[name="vehicle"]').append('<option value="' + vehicle.id + '">' + fuelEconomy.vehicleName(vehicle) + '</option>');
    });

});