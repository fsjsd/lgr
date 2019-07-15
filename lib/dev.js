'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

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

// with credit to Martin Ankerl for the idea to use the golden ratio
// to select distinct hues from around the hue wheel.
// https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
// # use golden ratio
var golden_ratio_conjugate = 0.618033988749895; //let h = Math.random(); // # use random start value

var h = 0.333;

var generateBestHue = function generateBestHue() {
  h += golden_ratio_conjugate;
  h %= 1;
  var hue = Math.floor(360 * h);
  return hue;
};

var colorMapCache = {};

var getColor = function getColor(value, pos) {
  var hue = colorMapCache[value];

  if (hue === undefined) {
    hue = generateBestHue();
    colorMapCache[value] = hue;
  }
  /*
  0 = 0     20
  1 = 10    10
  2 = 15    5
  3 = 17    
  n = 20
  */
  //console.log("getColor", { value, pos, hue });
  //return `hsl(${hue}, 70%, ${45 + pos * 20}%)`;


  return "hsl(".concat(hue, ", 70%, ").concat(45 + pos * 5, "%)");
};

var getTimeStamp = function getTimeStamp() {
  /*
  getHours() - Returns the hour of the day (0-23).
  getMinutes() - Returns the minute (0-59).
  getSeconds() - Returns the second (0-59).
  getMilliseconds() - Returns the milliseconds (0-999).
  */
  var now = new Date();
  return "".concat(now.getHours().toString().padStart(2, "0"), ":").concat(now.getMinutes().toString().padStart(2, "0"), ":").concat(now.getSeconds().toString().padStart(2, "0"), ".").concat(now.getMilliseconds());
};

var globalConfig = {
  disabled: false,
  disableInProduction: true
};
var transports = [];

var clearTransports = function clearTransports() {
  transports.length = 0;
};

var registerTransport = function registerTransport(transport) {
  if (!globalConfig.disabled && !(globalConfig.disableInProduction && process && process.env && "development" === "production") && transport.isAvailableInEnvironment(globalConfig)) {
    transport.initialise();
    transports.push(transport);
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
    }

    if (config.timestamp) {
      return [getTimeStamp()].concat(args);
    } // untouched


    return args;
  };
}; // enumerate transports and call the log method on each, applying
// default transforms to args before each writer manipulates further


var dispatchToTransports = function dispatchToTransports(level, config) {
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (transports.length === 0) {
      throw new Error("lgr: No logging transports defined");
    } // this is essentially compose()


    transports.map(function (transport) {
      return transport.dispatch(level, config).apply(void 0, _toConsumableArray(transformArgs(config).apply(void 0, args)));
    });
  };
};

var levels = ["log", "debug", "error", "warn", "fatal"];
/*
const outputs = function(config) {
  return {
    log: (...args) => dispatchToTransports("log", config)(...args),
    debug: (...args) => dispatchToTransports("debug", config)(...args),
    error: (...args) => dispatchToTransports("error", config)(...args),
    warn: (...args) => dispatchToTransports("warn", config)(...args)
  };
};

// declare 'base' logger as a higher order function accepting config
// as a pass-through argument
const lgr = config => outputs(config);

// but attach each log method as direct methods onto the base function itself
// so each method can be called directly on the function itself it there is
// no config to pass through
levels.map(level => (lgr[level] = (...args) => outputs()[level](...args)));
*/

exports.lgr = null;

exports.lgr = function lgr() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    meta: []
  };

  var newLgr = function newLgr() {
    var newConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      meta: []
    };
    return exports.lgr(_objectSpread({}, config, newConfig, {
      meta: [].concat(_toConsumableArray(config.meta || []), [newConfig.meta || []])
    }));
  };

  levels.map(function (level) {
    return newLgr[level] = function () {
      return dispatchToTransports(level, config).apply(void 0, arguments);
    };
  });
  return newLgr;
};

var makeLogStyle = function makeLogStyle() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$backgroundColor = _ref.backgroundColor,
      backgroundColor = _ref$backgroundColor === void 0 ? null : _ref$backgroundColor,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? "white" : _ref$color;

  var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  //const fontsize = `$1.${5 * i}rem`;
  var fontsize = "$1.5rem";
  var bgColor = backgroundColor === null ? getColor(meta, i) : backgroundColor;
  return "background-color:".concat(bgColor, ";color:").concat(color, ";border-radius:3px;padding:2px 4px;margin-left:2px;font-size:").concat(fontsize, ";font-weight:").concat(i === 0 ? "bold" : "normal");
};

var transformConsoleArgs = function transformConsoleArgs(config) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (config === undefined) return args;

    if (config.meta) {
      var metaArgs = typeof config.meta === "string" ? ["%c".concat(config.meta), makeLogStyle(config, config.meta)] : [config.meta.map(function (meta) {
        return "%c".concat(meta);
      }).join("")].concat(_toConsumableArray(config.meta.map(function (meta, i) {
        return makeLogStyle(config, config.meta[0], i);
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

var consoleTransport = {
  isAvailableInEnvironment: isAvailableInEnvironment,
  dispatch: dispatch,
  initialise: initialise
};

var terminalColors = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",
  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",
  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m"
}; // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color


var colorLookup = function colorLookup(col) {
  return col in terminalColors ? terminalColors[col] : terminalColors.FgGreen;
};

var transformConsoleArgs$1 = function transformConsoleArgs(config) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (config === undefined) return args; // TODO: This needs work!

    if (config.meta) {
      var metaArgs = typeof config.meta === "string" ? ["".concat(colorLookup(config.color), "%s").concat(terminalColors.Reset), config.meta] : config.meta.reduce(function (acc, curr) {
        return [].concat(_toConsumableArray(acc), ["".concat(colorLookup(config.color), "%s").concat(terminalColors.Reset), curr]);
      }, []); //console.log("ARGDEBUG", [...metaArgs, ...args]);

      return [].concat(_toConsumableArray(metaArgs), args);
    }

    return args;
  };
};

var isAvailableInEnvironment$1 = function isAvailableInEnvironment() {
  return console !== undefined;
};

var dispatch$1 = function dispatch(level, config) {
  return function () {
    var _console;

    (_console = console)[level].apply(_console, _toConsumableArray(transformConsoleArgs$1(config).apply(void 0, arguments)));
  };
};

var initialise$1 = function initialise() {};

var nodeTransport = {
  isAvailableInEnvironment: isAvailableInEnvironment$1,
  dispatch: dispatch$1,
  initialise: initialise$1
};

var writerOutputEl = null;

var makeLogStyle$1 = function makeLogStyle() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$backgroundColor = _ref.backgroundColor,
      backgroundColor = _ref$backgroundColor === void 0 ? null : _ref$backgroundColor,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? "white" : _ref$color;

  var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var bgColor = backgroundColor === null ? getColor(meta, i) : backgroundColor;
  return "display:inline-block;background-color:".concat(bgColor, ";color:").concat(color, ";border-radius:3px;padding:2px 4px;margin-left:2px;");
};

var transformConsoleArgs$2 = function transformConsoleArgs(config) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (config === undefined) return args;

    if (config.meta) {
      var metaArgs = typeof config.meta === "string" ? "<div style=\"".concat(makeLogStyle$1(config, config.meta), "\">").concat(config.meta, "</div>") : config.meta.map(function (meta, i) {
        return "<div style=\"".concat(makeLogStyle$1(config, config.meta[0], i), "\">").concat(meta, "</div>");
      }).join(""); //console.log("ARGDEBUG", [...metaArgs, ...args]);

      return [metaArgs].concat(args).join(" ");
    }

    return args;
  };
};

var lineStyles = {
  log: "",
  debug: "color:blue",
  error: "color:red",
  warn: "color:orange"
};

var isAvailableInEnvironment$2 = function isAvailableInEnvironment() {
  return window !== undefined && window.document !== undefined;
};

var makeStyle = function makeStyle(styles) {
  return Object.keys(styles).map(function (cssProp) {
    return "".concat(cssProp, ":").concat(styles[cssProp]);
  }).join(";");
};

var makeEl = function makeEl() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      tag = _ref2.tag,
      style = _ref2.style,
      attrs = _ref2.attrs,
      html = _ref2.html,
      children = _ref2.children,
      refOut = _ref2.refOut,
      events = _ref2.events;

  var el = document.createElement(tag);

  if (html) {
    el.innerHTML = html;
  }

  if (style) {
    var styleVal = makeStyle(style);
    el.setAttribute("style", styleVal);
  }

  if (refOut) {
    //console.log("refOut", el);
    refOut(el);
  }

  if (attrs) {
    for (var attr in attrs) {
      var attrVal = attrs[attr];
      el.setAttribute(attr, attrVal);
    }
  }

  if (events) {
    for (var ev in events) {
      el.addEventListener(ev, events[ev]);
    }
  }

  children && children.map(function (childEl) {
    el.appendChild(makeEl(childEl));
  });
  return el;
};

var initialise$2 = function initialise() {
  var existingOutput = document.getElementById("lgr_html_dom_writer__"); // don't remount

  if (existingOutput) {
    return;
  } //writerOutputEl;


  var wrapper = makeEl({
    tag: "DIV",
    // WRAPPER
    attrs: {
      id: "lgr_html_dom_writer__",
      draggable: "draggable"
    },
    style: {
      display: "flex",
      "flex-direction": "column",
      position: "fixed",
      width: "400px",
      top: "300px",
      "background-color": "rgba(255,255,255,0.9)",
      bottom: "0px",
      right: "0px",
      overflow: "hidden",
      border: "solid 1px #007fe0",
      "font-size": "12px",
      "font-family": "Helvetica, arial"
    },
    children: [{
      tag: "DIV",
      // HEADER
      style: {
        color: "white",
        display: "flex",
        "flex-direction": "row",
        "background-color": "#007fe0",
        padding: "10px",
        "font-size": "12px"
      },
      children: [{
        tag: "DIV",
        html: "lgr",
        style: {
          "flex-grow": "2"
        }
      }, {
        tag: "DIV",
        html: "&#0149;",
        style: {
          "align-self": "flex-end",
          "font-size": "20px",
          "line-height": "0.5pt",
          height: "14px",
          "letter-spacing": "0.5pt"
        },
        events: {
          click: function click() {
            writerOutputEl.innerHTML = "ACCESS";
          }
        }
      }]
    }, {
      tag: "DIV",
      // CONTENT
      refOut: function refOut(el) {
        writerOutputEl = el;
      },
      style: {
        "flex-grow": 2,
        padding: "10px",
        overflow: "scroll"
      }
    }]
  }); //console.log("wrapper", wrapper);

  document.body.appendChild(wrapper);
};

var dispatch$2 = function dispatch(level, config) {
  return function () {
    var line = document.createElement("DIV");
    line.setAttribute("style", "margin-bottom:2px;".concat(lineStyles[level]));
    line.innerHTML = transformConsoleArgs$2(config).apply(void 0, arguments);
    writerOutputEl.append(line);
  };
};

var htmlDomTransport = {
  isAvailableInEnvironment: isAvailableInEnvironment$2,
  dispatch: dispatch$2,
  initialise: initialise$2
};

var lgrBrowser = function lgrBrowser() {
  registerTransport(consoleTransport);
  return exports.lgr({});
};

var lgrNode = function lgrNode() {
  registerTransport(nodeTransport);
  return exports.lgr({});
};

exports.clearTransports = clearTransports;
exports.consoleTransport = consoleTransport;
exports.htmlDomTransport = htmlDomTransport;
exports.lgrBrowser = lgrBrowser;
exports.lgrNode = lgrNode;
exports.nodeTransport = nodeTransport;
exports.registerTransport = registerTransport;
