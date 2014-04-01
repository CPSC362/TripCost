(function(Handlebars) {
    Handlebars.registerHelper('formatNumber', function(number) {
        var decimalPlaces = isNaN(decimalPlaces = Math.abs(decimalPlaces)) ? 2 : decimalPlaces,
            decimalSeparator = decimalSeparator == undefined ? "." : decimalSeparator,
            commaSeparator = commaSeparator == undefined ? "," : commaSeparator,
            sign = number < 0 ? "-" : "",
            i = parseInt(number = Math.abs(+number || 0).toFixed(decimalPlaces)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return sign + (j ? i.substr(0, j) + commaSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + commaSeparator) + (decimalPlaces ? decimalSeparator + Math.abs(number - i).toFixed(decimalPlaces).slice(2) : "");
    });
})(window.Handlebars);