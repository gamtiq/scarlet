var assert = require("assert");
var enumerable = require("../../lib/extensions/enumerable");

var TypeAssertionBuilder = require("./types/type-assertion-builder");
var InterceptorAssertionBuilder = require("./interceptors/interceptor-assertion-builder");
var EventAssertionBuilder = require("./events/event-assertion-builder");

module.exports = function PropertyAssertionBuilder(instance,propertyName){
	var builders = {
		typeAssertionBuilder : new TypeAssertionBuilder(),
		eventAssertionBuilder : new EventAssertionBuilder(),
		interceptorAssertionBuilder : new InterceptorAssertionBuilder()
	};

	this.withEvents = function(events){
		builders.eventAssertionBuilder.withEvents(events);
		return this;
	};

	this.withInterceptors = function(interceptors){
		builders.interceptorAssertionBuilder.withInterceptors(interceptors);
		return this;
	};

	this.withExpectedResult = function(result){
		this.result = result;
		return this;
	};
	
	this.withParameters = function(parameters){
		this.parameters = parameters;
		return this;
	};

	this.assert = function(){
		enumerable.forEach(builders,function(builder){
			builder.forProperty();
		});

		builders.typeAssertionBuilder.assert(instance, this.result, propertyName,function(instance,result,propertyName){
			builders.interceptorAssertionBuilder.assert(instance,result,propertyName);
			builders.eventAssertionBuilder.assert(instance,result,propertyName);
		});
	};
};