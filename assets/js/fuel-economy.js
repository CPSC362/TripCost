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
    function FuelEconomy(jQuery) {
        
        // Map jQuery dependency
        this.$ = jQuery;

        this._spinner = null;

        this.vehicle = {
            year: null,
            make: null,
            model: null,
            id: null
        };

        var base = '/';

        this.getVehicleMenuYear = function(callback) {

            var endpoint = base + 'vehicle-menu-year';

            this.loading(true);
            
            $.ajax({
                url: endpoint,
                success: callback,
                method: "GET"
            });
            
        };

        this.getVehicleMenuMake = function(callback) {

            var endpoint = base + 'vehicle-menu-make';

            this.loading(true);

            $.ajax({
                url: endpoint,
                data: this.vehicle,
                success: callback,
                method: "GET"
            });
        };

        this.getVehicleMenuModel = function(callback) {

            var endpoint = base + 'vehicle-menu-model';

            this.loading(true);

            $.ajax({
                url: endpoint,
                data: this.vehicle,
                success: callback,
                method: "GET"
            });
        };

        this.getVehicleMenuOptions = function(callback) {

            var endpoint = base + 'vehicle-menu-options';

            this.loading(true);

            $.ajax({
                url: endpoint,
                data: this.vehicle,
                success: callback,
                method: "GET"
            });
        };
    };

    FuelEconomy.prototype.vehicleYearMenu = function(selectMenu) {

        var self = this;

        this.getVehicleMenuYear(function(data, textStatus) {
            self.loading(false);
            self._populateSelect(selectMenu, data);
        });
    };

    FuelEconomy.prototype.vehicleMakeMenu = function(year, selectMenu) {

        this.vehicle.year = year;

        var self = this;

        this.getVehicleMenuMake(function(data, textStatus) {
            self.loading(false);
            self._populateSelect(selectMenu, data);
        });
    };

    FuelEconomy.prototype.vehicleModelMenu = function(make, selectMenu) {

        this.vehicle.make = make;

        var self = this;

        this.getVehicleMenuModel(function(data, textStatus) {
            self.loading(false);
            self._populateSelect(selectMenu, data);
        });
    };

    FuelEconomy.prototype.vehicleOptionsMenu = function(model, selectMenu) {

        this.vehicle.model = model;

        var self = this;

        this.getVehicleMenuOptions(function(data, textStatus) {
            self.loading(false);
            self._populateSelect(selectMenu, data);
        });
    };

    FuelEconomy.prototype.saveVehicle = function(formElement, finishCallback) {

        var form = $(formElement);

        this.vehicle = form.serializeObject();

        // Save vehicle to user account...

        finishCallback();
    };

    FuelEconomy.prototype._populateSelect = function(selectMenu, data) {
        $.each(data.menuItem, function(index, item) {
            $(selectMenu).append($("<option></option>").attr("value", item.value).text(item.text));
        });
    };

    FuelEconomy.prototype.loading = function(status) {
        if (status) {
            $(this._spinner).show();
        } else {
            $(this._spinner).hide();
        }
    };

    FuelEconomy.prototype.setSpinner = function(spinnerElement) {
        this._spinner = spinnerElement;
    };

    return FuelEconomy;

})(jQuery);

$.fn.serializeObject=function(){var e={};var t=this.serializeArray();$.each(t,function(){if(e[this.name]){if(!e[this.name].push){e[this.name]=[e[this.name]]}e[this.name].push(this.value||"")}else{e[this.name]=this.value||""}});return e}