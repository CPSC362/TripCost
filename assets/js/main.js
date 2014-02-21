$(function() {
    $('.dropdown-menu form').click(function(e) { e.stopPropagation(); });

    var tripCost = new TripCost('map-canvas', google);

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

});