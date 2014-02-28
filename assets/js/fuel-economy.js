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
    function FuelEconomy(Vehicle, jQuery) {
        
        // Map jQuery dependency
        this.$ = jQuery;

        this.vehicle = new Vehicle();

        this._spinner = null;

        this.menus = {
            year: null,
            make: null,
            model: null,
            options: null
        };

        this.yearMenuLoaded = false;

        this.serverError = 'There was a problem contacting the FuelEconomy.gov server';

        var baseUrl = '/';

        this.getVehicleMenuYear = function(callback) {

            var endpoint = baseUrl + 'vehicle-menu-year';

            this._loading(true);
            
            $.ajax({
                url: endpoint,
                success: callback,
                method: "GET"
            });
            
        };

        this.getVehicleMenuMake = function(callback) {

            var endpoint = baseUrl + 'vehicle-menu-make';

            this._loading(true);

            $.ajax({
                url: endpoint,
                data: this.vehicle,
                success: callback,
                method: "GET"
            });
        };

        this.getVehicleMenuModel = function(callback) {

            var endpoint = baseUrl + 'vehicle-menu-model';

            this._loading(true);

            $.ajax({
                url: endpoint,
                data: this.vehicle,
                success: callback,
                method: "GET"
            });
        };

        this.getVehicleMenuOptions = function(callback) {

            var endpoint = baseUrl + 'vehicle-menu-options';

            this._loading(true);

            $.ajax({
                url: endpoint,
                data: this.vehicle,
                success: callback,
                method: "GET"
            });
        };
    };

    FuelEconomy.prototype.vehicleYearMenu = function() {

        var self = this;

        if ( ! this.yearMenuLoaded) {
            this.getVehicleMenuYear(function(data, textStatus) {
                if (textStatus == "success") {
                    self.yearMenuLoaded = true;
                    self._loading(false);
                    self._populateSelect(self.menus.year, data);
                    self._eraseSelection([self.menus.make, self.menus.model, self.menus.options]);
                } else {
                    alert(this.serverError);
                }
            });
        }
    };

    FuelEconomy.prototype.vehicleMakeMenu = function(year) {

        this.vehicle.year = year;

        var self = this;

        this.getVehicleMenuMake(function(data, textStatus) {
            if (textStatus == "success") {
                self._loading(false);
                self._populateSelect(self.menus.make, data);
                self._eraseSelection([self.menus.model, self.menus.options]);
            } else {
                alert(this.serverError);
            }
        });
    };

    FuelEconomy.prototype.vehicleModelMenu = function(make) {

        this.vehicle.make = make;

        var self = this;

        this.getVehicleMenuModel(function(data, textStatus) {
            if (textStatus == "success") {
                self._loading(false);
                self._populateSelect(self.menus.model, data);
                self._eraseSelection([self.menus.options]);
            } else {
                alert(this.serverError);
            }
        });
    };

    FuelEconomy.prototype.vehicleOptionsMenu = function(model) {

        this.vehicle.model = model;

        var self = this;

        this.getVehicleMenuOptions(function(data, textStatus) {
            if (textStatus == "success") {
                self._loading(false);
                self._populateSelect(self.menus.options, data);
            } else {
                alert(this.serverError);
            }
        });
    };

    FuelEconomy.prototype.saveVehicle = function(formElement, finishCallback) {
        
        this._loading(true);

        var form = $(formElement);

        var vehicleProperties = form.serializeObject();

        this.vehicle.year      = vehicleProperties.year;
        this.vehicle.make      = vehicleProperties.make;
        this.vehicle.model     = vehicleProperties.model;
        this.vehicle.vehicleId = vehicleProperties.vehicleId;

        // Save vehicle to user account...

        finishCallback(this.vehicle);

        this._loading(false);
    };

    FuelEconomy.prototype._populateSelect = function(selectMenu, data) {
        
        $(selectMenu).find('option:first-child').text('Choose...');
        $(selectMenu).find('option:not(:eq(0))').remove();

        if (data.menuItem instanceof Array) {
            $.each(data.menuItem, function(index, item) {
                $(selectMenu).append($("<option></option>").attr("value", item.value).text(item.text));
            });
        } else {
            $(selectMenu).append($("<option></option>").attr("value", data.menuItem.value).text(data.menuItem.text));
        }
        
    };

    FuelEconomy.prototype._eraseSelection = function(menusToErase) {
        $.each(menusToErase, function (index, menuToErase) {
            $(menuToErase).find('option:not(:eq(0))').remove();
        });
    };

    FuelEconomy.prototype._loading = function(status) {
        if (status) {
            $(this._spinner).show();
        } else {
            $(this._spinner).hide();
        }
    };

    FuelEconomy.prototype.setSpinner = function(spinnerElement) {
        this._spinner = spinnerElement;
    };

    FuelEconomy.prototype.reset = function(form) {
        $(form).find('select').val('');
    };

    return FuelEconomy;

})(jQuery);

$.fn.serializeObject=function(){var e={};var t=this.serializeArray();$.each(t,function(){if(e[this.name]){if(!e[this.name].push){e[this.name]=[e[this.name]]}e[this.name].push(this.value||"")}else{e[this.name]=this.value||""}});return e}