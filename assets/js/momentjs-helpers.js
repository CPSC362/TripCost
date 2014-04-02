(function(moment) {

    moment.parseHumanized = function(humanizedString) {
        var dateParts = humanizedString.split(' ');

        if (dateParts.length == 3) { // "3 months ago"
            return moment().subtract(parseInt(dateParts[0]), dateParts[1]);
        } else {
            return null;
        }
    }

})(window.moment);