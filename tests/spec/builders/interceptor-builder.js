var assert = require("assert");
var dummies = require("./dummies");
var logger = require("../../../lib/extensions/logger");
var object = require("../../../lib/extensions/object");
var enumerable = require("../../../lib/extensions/enumerable");

function Interceptor(scarletBuilder) {

	var self = this;
	self.results = [];
	self.timesCalled = 0;
	self.proxyInfo = null;

	self.intercept = function(proceed,info) {
		
		logger.debug(Interceptor, "methodCalled", "Inside Interceptor ", [self, info]);

		var memberName = info.memberName();
		if (typeof(self.results[memberName]) == "undefined")
			self.results[memberName] = {
				timesCalled: 0,
				results: []
			};

		var current = self.results[memberName];
		current.timesCalled += 1;
		current.proxyInfo = info.proxyInfo;
		current.result = proceed();
		return current.result;
	};

	self.reset = function() {
		self.results = [];
	};
}

function InterceptorBuilder(scarletBuilder, instances, replaceInstancesCallback) {

	var self = this;
	self.interceptor = new Interceptor(scarletBuilder);

	self.methodCalled = function(times) {
		logger.debug(InterceptorBuilder, "methodCalled", "Inside Method Called", [self.interceptor, self.interceptor.results]);
		if (typeof(times) === "undefined")
			assert(self.interceptor.results["method"].timesCalled > 0);
		else
			assert(self.interceptor.results["method"].timesCalled === times, "Expected " + times + " call(s) but only got " + self.interceptor.results["method"].timesCalled);
		return self;
	};

	self.methodWithReturnCalled = function(times) {
		logger.debug(InterceptorBuilder, "methodWithReturnCalled", "Inside Method With Return Called", [self.interceptor, self.interceptor.results]);
		if (typeof(times) == "undefined")
			assert(self.interceptor.results["methodWithReturn"].timesCalled > 0);
		else
			assert(self.interceptor.results["methodWithReturn"].timesCalled === times, "Expected " + times + " call(s) but only got " + self.interceptor.results["methodWithReturn"].timesCalled);
		return self;
	};

	self.reset = function() {
		self.interceptor.reset();
	};

	var proxiedInstances = [];
	enumerable.forEach(instances, function(instance) {
		var proxiedTypeOrInstance =
			scarletBuilder
				.scarlet
				.intercept(instance)
				.using(self.interceptor.intercept)
				.proxy();
		proxiedInstances.push(proxiedTypeOrInstance);
	});

	if (!object.isNull(replaceInstancesCallback)) {
		logger.debug(InterceptorBuilder, InterceptorBuilder, "Replacing Instances with Proxies", proxiedInstances);
		replaceInstancesCallback(proxiedInstances);
	}
}

module.exports = InterceptorBuilder;