'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var makeStyle = function makeStyle() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$backgroundColor = _ref.backgroundColor,
      backgroundColor = _ref$backgroundColor === void 0 ? "black" : _ref$backgroundColor,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? "white" : _ref$color;

  return "background-color:".concat(backgroundColor, ";color:").concat(color, ";border-radius:3px;padding:2px 4px;margin-left:2px;");
};

var transformConsoleArgs = function transformConsoleArgs(config) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (config === undefined) return args;

    if (config.meta) {
      var metaArgs = typeof config.meta === "string" ? ["%c".concat(config.meta), makeStyle(config)] : [config.meta.map(function (meta) {
        return "%c".concat(meta);
      }).join("")].concat(_toConsumableArray(config.meta.map(function (meta) {
        return makeStyle(config);
      }))); //console.log("ARGDEBUG", [...metaArgs, ...args]);

      return [].concat(_toConsumableArray(metaArgs), args);
    }

    return args;
  };
};

var isAvailableInEnvironment = function isAvailableInEnvironment() {
  return console !== undefined;
};

var dispatch = function dispatch(level, config) {
  return function () {
    var _console;

    (_console = console)[level].apply(_console, _toConsumableArray(transformConsoleArgs(config).apply(void 0, arguments)));
  };
};

var initialise = function initialise() {};

var consoleWriter = {
  isAvailableInEnvironment: isAvailableInEnvironment,
  dispatch: dispatch,
  initialise: initialise
};

var globalConfig = {
  disabled: false,
  disableInProduction: true
};
var writerMiddlewares = [];

var registerWriterMiddleware = function registerWriterMiddleware(middleware) {
  if (!globalConfig.disabled && !(globalConfig.disableInProduction && process && process.env && "production" == "production") && middleware.isAvailableInEnvironment(globalConfig)) {
    middleware.initialise();
    writerMiddlewares.push(middleware);
  }
}; // args transform routine. This can be extended
// with common/shared behaviours, but be mindful
// whether individual writers can support shared
// implementations


var transformArgs = function transformArgs(config) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (config === undefined) return args;

    if (config.smile) {
      return [":)"].concat(args);
    } // untouched


    return args;
  };
}; // enumerate writers and call the log method on each, applying
// default transforms to args before each writer manipulates further


var dispatchToWriters = function dispatchToWriters(level, config) {
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    // this is essentially compose()
    writerMiddlewares.map(function (writer) {
      return writer.dispatch(level, config).apply(void 0, _toConsumableArray(transformArgs(config).apply(void 0, args)));
    });
  };
};

var levels = ["log", "debug", "error", "warn", "fatal"];

var outputs = function outputs(config) {
  return {
    log: function log() {
      return dispatchToWriters("log", config).apply(void 0, arguments);
    },
    debug: function debug() {
      return dispatchToWriters("debug", config).apply(void 0, arguments);
    },
    error: function error() {
      return dispatchToWriters("error", config).apply(void 0, arguments);
    },
    warn: function warn() {
      return dispatchToWriters("warn", config).apply(void 0, arguments);
    }
  };
}; // declare 'base' logger as a higher order function accepting config
// as a pass-through argument


var lgr = function lgr(config) {
  return outputs(config);
}; // but attach each log method as direct methods onto the base function itself
// so each method can be called directly on the function itself it there is
// no config to pass through


levels.map(function (level) {
  return lgr[level] = function () {
    var _outputs;

    return (_outputs = outputs())[level].apply(_outputs, arguments);
  };
});

var lgrBrowser = function lgrBrowser() {
  registerWriterMiddleware(consoleWriter);
  return lgr;
};

exports.lgr = lgr;
exports.lgrBrowser = lgrBrowser;
exports.registerWriterMiddleware = registerWriterMiddleware;
