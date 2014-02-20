$(function() {

    if (typeof google !== 'undefined') {
        var map;
        function initialize() {
            map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 15,
                center: new google.maps.LatLng(33.8596069, -117.8867514),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
        }

        google.maps.event.addDomListener(window, 'load', initialize);

        $('.form-container .close').click(function(e) {
            e.preventDefault();

            $('.form-container').slideUp();
        });

        $('a[href="/#directions"]').click(function(e) {
            e.preventDefault();

            $('.form-container').slideDown();
        });
    }
});