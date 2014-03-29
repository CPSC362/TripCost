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
var FuelEconomy = (function() {

    // Constructor method
    function FuelEconomy(jQuery, edmundsAPI) {

        // Map jQuery dependency
        this.$ = jQuery;

        this.edmundsAPI = edmundsAPI;

        this.vehicle = null;

        this._vehicleMetadata = {};

        this._spinner = null;

        this.menus = {
            year: null,
            make: null,
            model: null,
            options: null
        };

        this.serverError = 'There was a problem contacting the FuelEconomy.gov server';

    };

    FuelEconomy.prototype = {
        vehicleYearMenu: function() {

            var self = this;

            var d = new Date();
            var upperBound = d.getFullYear() + 2; // 2 years in the future
            var lowerBound = 1990; // Edmunds supports as far as 1990

            var years = new Array();

            for (var i = upperBound; i >= lowerBound; --i) {
                years.push(i);
            }

            this._populateSelect(this.menus.year, years, years);
            this._eraseSelection([this.menus.make, this.menus.model, this.menus.options]);
        },

        vehicleMakeMenu: function() {

            var self = this;

            this._loading(true);

            var options = {
                year: this._vehicleMetadata.year
            };

            this.edmundsAPI.api('/api/vehicle/v2/makes', options, function(makesResponse) {

                console.log("makesResponse: ", makesResponse);

                var keys = new Array(),
                    values = new Array();

                for (var i = 0, s = makesResponse.makesCount; i < s; ++i) {
                    keys.push(makesResponse.makes[i].niceName);
                    values.push(makesResponse.makes[i].name);
                }

                self._populateSelect(self.menus.make, keys, values);
                self._eraseSelection([self.menus.model, self.menus.options]);

                self._loading(false);
            });
        },

        vehicleModelMenu: function() {

            var self = this;

            this._loading(true);

            this.edmundsAPI.api('/api/vehicle/v2/' + this._vehicleMetadata.make + '/models', null, function(modelsResponse) {

                console.log("modelsResponse: ", modelsResponse);

                var keys = new Array(),
                    values = new Array();

                for (var i = 0, s = modelsResponse.modelsCount; i < s; ++i) {
                    keys.push(modelsResponse.models[i].niceName);
                    values.push(modelsResponse.models[i].name);
                }

                self._populateSelect(self.menus.model, keys, values);
                self._eraseSelection([self.menus.options]);

                self._loading(false);
            });
        },

        vehicleOptionsMenu: function() {

            var self = this;

            this._loading(true);

            var params = this._vehicleMetadata.make + '/' + this._vehicleMetadata.model + '/' + this._vehicleMetadata.year;

            this.edmundsAPI.api('/api/vehicle/v2/' + params, null, function(optionsResponse) {

                console.log("optionsResponse: ", optionsResponse);

                var keys = new Array(),
                    values = new Array();

                for (var i = 0, s = optionsResponse.styles.length; i < s; ++i) {
                    keys.push(optionsResponse.styles[i].id);
                    values.push(optionsResponse.styles[i].name);
                }

                self._populateSelect(self.menus.options, keys, values);

                self._loading(false);

            });
        },

        showVehiclePreview: function(VehicleClass, callbackWhenFinished) {

            this._loading(true);

            var self = this;

            var options = {
                styleId: this._vehicleMetadata.vehicleId
            };

            var returnData = {
                url: null,
                description: this._vehicleMetadata.year + ' ' + this._vehicleMetadata.make + ' ' + this._vehicleMetadata.model
            };

            this.edmundsAPI.api('/v1/api/vehiclephoto/service/findphotosbystyleid', options, function(vehicleMediaInformationResponse) {

                var baseUrl = 'http://media.ed.edmunds-media.com';

                for (var i = 0, s = vehicleMediaInformationResponse.length; i < s; ++i) {
                    if (vehicleMediaInformationResponse[i].subType == 'exterior' &&
                        vehicleMediaInformationResponse[i].shotTypeAbbreviation == 'FQ') {

                        returnData.url = baseUrl + VehicleClass.prototype.optimalImageSrc(vehicleMediaInformationResponse[i].photoSrcs, 'th');
                    }
                }

                self._loading(false);

                callbackWhenFinished(returnData);
            }, function() {
                // Failure
                callbackWhenFinished(returnData);
            });
        },

        getVehicleMetadata: function() {
            return this._vehicleMetadata;
        },

        setVehicleMetadata: function(key, value) {
            this._vehicleMetadata[key] = value;
        },

        saveVehicle: function(vehicle, finishCallback) {

            this._loading(true);

            // Save vehicle to user account...

            finishCallback();

            this._loading(false);
        },

        _populateSelect: function(selectMenu, keys, values) {

            $(selectMenu).find('option:first-child').text('Choose...');
            $(selectMenu).find('option:not(:eq(0))').remove();

            if (keys.length != values.length) {
                DEBUG && alert('_populateSelect: keys and values must be of the same length');
                console.log('_populateSelect: keys and values must be of the same length');
                return;
            }

            for (var i = 0, s = keys.length; i < s; ++i) {
                this.$(selectMenu).append(this.$("<option></option>").attr("value", keys[i]).text(values[i]));
            }
        },

        _eraseSelection: function(menusToErase) {
            $.each(menusToErase, function(index, menuToErase) {
                $(menuToErase).find('option:not(:eq(0))').remove();
            });
        },

        _loading: function(status) {
            if (status) {
                $(this._spinner).show();
                console.log("Spinner: ON");
            } else {
                $(this._spinner).hide();
                console.log("Spinner: OFF");
            }
        },

        setSpinner: function(spinnerElement) {
            this._spinner = spinnerElement;
        },

        reset: function(form) {
            $(form).find('select').val('');
        }
    };

    return FuelEconomy;

})();