$(function() {
    $('.dropdown-menu form').click(function(e) { e.stopPropagation(); });

    var tripCost = new TripCost('map-canvas', google);
    var fuelEconomy = new FuelEconomy(jQuery);
    fuelEconomy.setSpinner('.add-vehicle-spinner');

    $('#findRoute').click(function(e) {
        e.preventDefault();

        // Get menus out of the way
        closeMenus();

        tripCost.getDirections($('#start').val(), $('#destination').val());
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
        });
    });

});