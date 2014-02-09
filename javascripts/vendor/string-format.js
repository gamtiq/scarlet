(function() {
  var ValueError, format, lookup, resolve,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  ValueError = (function(_super) {
    __extends(ValueError, _super);

    function ValueError(message) {
      this.message = message;
    }

    ValueError.prototype.name = 'ValueError';

    return ValueError;

  })(Error);

  format = function() {
    var args, explicit, idx, implicit, message, template;
    template = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    idx = 0;
    explicit = implicit = false;
    message = 'cannot switch from {} to {} numbering';
    return template.replace(/([{}])\1|[{](.*?)(?:!(.+?))?[}]/g, function(match, literal, key, transformer) {
      var fn, value, _ref, _ref1;
      if (literal) {
        return literal;
      }
      if (key.length) {
        explicit = true;
        if (implicit) {
          throw new ValueError(message.format('implicit', 'explicit'));
        }
        value = (_ref = lookup(args, key)) != null ? _ref : '';
      } else {
        implicit = true;
        if (explicit) {
          throw new ValueError(message.format('explicit', 'implicit'));
        }
        value = (_ref1 = args[idx++]) != null ? _ref1 : '';
      }
      if (fn = format.transformers[transformer]) {
        return fn(value);
      } else {
        return value;
      }
    });
  };

  lookup = function(object, key) {
    var match;
    if (!/^(\d+)([.]|$)/.test(key)) {
      key = '0.' + key;
    }
    while (match = /(.+?)[.](.+)/.exec(key)) {
      object = resolve(object, match[1]);
      key = match[2];
    }
    return resolve(object, key);
  };

  resolve = function(object, key) {
    var value;
    value = object[key];
    if (typeof value === 'function') {
      return value.call(object);
    } else {
      return value;
    }
  };

  String.prototype.format = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return format.apply(null, [this].concat(__slice.call(args)));
  };

  String.prototype.format.transformers = format.transformers = {};

  String.prototype.format.version = format.version = '0.2.1';

  if (typeof module !== "undefined" && module !== null) {
    module.exports = format;
  }

}).call(this);
