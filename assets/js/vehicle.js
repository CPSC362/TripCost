// function:
var Vehicle = (function(){
    
    function Vehicle(attrs) {
        this.year      = (attrs) ? attrs.year : null;
        this.make      = (attrs) ? attrs.make : null;
        this.model     = (attrs) ? attrs.model : null;
        this.vehicleId = (attrs) ? attrs.vehicleId : null;
    };

    Vehicle.prototype.name = function() {
        return this.year + ' ' + this.make + ' ' + this.model;
    }

    return Vehicle;

})();
