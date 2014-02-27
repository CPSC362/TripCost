// function:
var Vehicle = (function(){
    
    function Vehicle() {
        this.year = null;
        this.make      = null;
        this.model     = null;
        this.vehicleId = null;
    };

    Vehicle.prototype.name = function() {
        return this.year + ' ' + this.make + ' ' + this.model;
    }

    return Vehicle;

})();
