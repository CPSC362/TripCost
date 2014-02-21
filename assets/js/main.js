$(function() {

    $('.dropdown-menu form').click(function(e) { e.stopPropagation(); });

    if (typeof google !== 'undefined') {
        
        var map,
            directionsDisplay,
            directionsService = new google.maps.DirectionsService();

        function initialize() {

            directionsDisplay = new google.maps.DirectionsRenderer();

            var calStateFullerton = new google.maps.LatLng(33.8596069, -117.8867514);

            map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 15,
                center: calStateFullerton,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            directionsDisplay.setMap(map);
        }

        google.maps.event.addDomListener(window, 'load', initialize);

        $('#findRoute').click(function(e) {
            e.preventDefault();

            // Get menus out of the way
            closeMenus();
            
            var start = $('#start').val();
            var destination = $('#destination').val();

            var request = {
                origin: start,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);
                }
            });
        });

        function closeMenus() {
            $('[data-toggle="dropdown"]').parent().removeClass('open');
            if ( ! $('.navbar-toggle').hasClass('collapsed')) {
                $('.navbar-toggle').click();
            }
        }

        // $('.form-container .close').click(function(e) {
        //     e.preventDefault();

        //     $('.form-container').slideUp();
        // });

        // $('a[href="/#directions"]').click(function(e) {
        //     e.preventDefault();

        //     $('.form-container').slideDown();
        // });
    }
});