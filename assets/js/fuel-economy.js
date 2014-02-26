/*
|--------------------------------------------------------------------------
| FuelEconomy
|--------------------------------------------------------------------------
|
| Created by Austin White <austinw@csu.fullerton.edu>
| California State University, Fullerton CPSC 362
| February 25, 2014
| 
| 
|
*/
var FuelEconomy = (function(jQuery){

    // Constructor method
    function FuelEconomy() {
        // Map jQuery dependency
        this.$ = jQuery;

        var base = '/';

        this.getVehicleMenuYear = function(callback) {

            var endpoint = base + 'vehicle-menu-year';

            this.loading(true);
            
            $.ajax({
                url: endpoint,
                success: callback,
                method: "GET"
            });
            
        }

        this.getVehicleMenuMake = function(year, callback) {

            var endpoint = base + 'vehicle-menu-make';

            this.loading(true);
            
            $.ajax({
                url: endpoint,
                params: { year: year },
                success: callback,
                method: "GET"
            });
            
        }
    };

    FuelEconomy.prototype.populateVehicleYearMenu = function(selectMenu) {

        var self = this;

        this.getVehicleMenuYear(function(data, textStatus) {
            self.loading(false);
            self._populateSelect(selectMenu, data);
        });
    }

    FuelEconomy.prototype.populateVehicleMakeMenu = function(selectMenu, year) {

        var self = this;

        this.getVehicleMenuYear(year, function(data, textStatus) {
            self.loading(false);
            self._populateSelect(selectMenu, data);
        });
    }

    FuelEconomy.prototype._populateSelect = function(selectMenu, data) {
        $.each(data.menuItem, function(index, item) {
            selectMenu.append($("<option></option>").attr("value", item.value).text(item.text));
        });
    }

    FuelEconomy.prototype.loading = function(status) {
        if (status) {

        } else {

        }
    }

    return FuelEconomy;

})(jQuery);