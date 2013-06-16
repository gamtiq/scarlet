function AnyObject() {

	var self = this;

	self.methodOne = function() {

	};

}

AnyObject.prototype.MethodTwo = function() {

};

function isObjectLiteral(_obj) {
	var _test = _obj;
	return (typeof _obj !== 'object' || _obj === null ?
		false :
		((function() {
			while (!false) {
				if (Object.getPrototypeOf(_test = Object.getPrototypeOf(_test)) === null) {
					break;
				}
			}
			return Object.getPrototypeOf(_obj) === _test;
		})()));
}

function getAllPropertyNames(obj) {
	var props = [];

	do {
		Object.getOwnPropertyNames(obj).forEach(function(prop) {
			if (props.indexOf(prop) === -1) {
				props.push(prop);
			}
		});
	} while (obj = Object.getPrototypeOf(obj));

	return props;
}

var names = getAllPropertyNames(new AnyObject());

for (var index = 0; index < names.length; index++) {
	console.log(names[index]);
}


function A(){
	console.log("Logging A");
}

function B(){
	A.call(this, arguments);
	console.log("Logging B");
}

B.prototype = new A();
B.constructor = B;

var b = new A();

console.log("...");

var c = new B();
