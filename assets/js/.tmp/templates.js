this["TripCostTemplates"] = this["TripCostTemplates"] || {};

this["TripCostTemplates"]["preview"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<a href=\"#\" class=\"thumbnail\">\n<img src=\"";
  if (helper = helpers.url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n</a>";
  return buffer;
  });

this["TripCostTemplates"]["results"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", helper, options;
  buffer += "\n          <div class=\"cost-analysis\">\n            <span class=\"label label-primary\">EPA Estimated Cost:</span>\n            <strong>$"
    + escapeExpression((helper = helpers.formatNumber || (depth0 && depth0.formatNumber),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.epa), options) : helperMissing.call(depth0, "formatNumber", (depth0 && depth0.epa), options)))
    + "</strong>\n          </div>\n          ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", helper, options;
  buffer += "\n          <div class=\"cost-analysis\">\n            <span class=\"label label-primary\">EGE Estimated Cost:</span>\n            <strong>$"
    + escapeExpression((helper = helpers.formatNumber || (depth0 && depth0.formatNumber),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.ege), options) : helperMissing.call(depth0, "formatNumber", (depth0 && depth0.ege), options)))
    + "</strong>\n          </div>\n          ";
  return buffer;
  }

  buffer += "<div class=\"row\">\n  <div class=\"col-md-12\">\n    <h1>Results</h1> <a href=\"#top\"><i class=\"fa fa-arrow-circle-o-up\"></i></a>\n  </div>\n</div>\n\n<div class=\"row\">\n  <div class=\"col-md-6\">\n    <h3>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h3>\n  </div>\n</div>\n\n<div class=\"row\">\n  <div class=\"col-md-6\">\n    <a href=\"#\" class=\"thumbnail\">\n      <img src=\"";
  if (helper = helpers.mainImage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.mainImage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n    </a>\n  </div>\n  <div class=\"col-md-6\">\n    <div class=\"panel panel-default\">\n      <div class=\"panel-heading\">\n        <h3 class=\"panel-title\">Trip Analysis</h3>\n      </div>\n      <div class=\"panel-body\">\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.epa), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.ege), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </ul>\n      </div>\n    </div>\n  </div>\n</div>";
  return buffer;
  });

this["TripCostTemplates"]["vehicles"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n<li data-vehicle-id=\"";
  if (helper = helpers.vehicleId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.vehicleId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n  <a href=\"#\" id=\"edit-vehicle-";
  if (helper = helpers.vehicleId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.vehicleId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n    ";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n    <span class=\"close link-close\"><i class=\"fa fa-trash-o\"></i></span>\n  </a>\n</li>\n";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n<li class=\"divider\"></li>\n";
  }

  stack1 = helpers.each.call(depth0, (depth0 && depth0.vehicles), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.vehicles)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<li>\n  <a data-toggle=\"modal\" data-target=\"#add-vehicle-modal\" href=\"#\"><i class=\"fa fa-plus\"></i> Add Vehicle</a>\n</li>";
  return buffer;
  });