// function:
var Vehicle = (function(){
    
    function Vehicle(attrs) {
        this.year      = (attrs) ? attrs.year : "";
        this.make      = (attrs) ? attrs.make : "";
        this.model     = (attrs) ? attrs.model : "";
        this.vehicleId = (attrs) ? attrs.vehicleId : null;
    };

    Vehicle.prototype.name = function() {
        if ( ! this.year || ! this.make || ! this.model)
            return "";
        else
            return this.year + ' ' + this.make + ' ' + this.model;
    }

    Vehicle.prototype.mpg = function(first_argument) {
        // body...
    };

    return Vehicle;

})();
