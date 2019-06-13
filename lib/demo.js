'use strict';

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
  } //console.log("getColor", { value, pos, hue });


  return "hsl(".concat(hue, ", 70%, ").concat(45 + pos * 20, "%)");
};

var getTimeStamp = function getTimeStamp() {
  /*
  getHours() - Returns the hour of the day (0-23).
  getMinutes() - Returns the minute (0-59).
  getSeconds() - Returns the second (0-59).
  getMilliseconds() - Returns the milliseconds (0-999).
  */
  var now = new Date();
  return "".concat(now.getHours(), ":").concat(now.getMinutes(), ":").concat(now.getSeconds(), ".").concat(now.getMilliseconds());
};

var globalConfig = {
  disabled: false,
  disableInProduction: true
};
var transports = [];

var registerTransport = function registerTransport(transport) {
  if (!globalConfig.disabled && !(globalConfig.disableInProduction && process && process.env && "demo" === "production") && transport.isAvailableInEnvironment(globalConfig)) {
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

    // this is essentially compose()
    transports.map(function (transport) {
      return transport.dispatch(level, config).apply(void 0, _toConsumableArray(transformArgs(config).apply(void 0, args)));
    });
  };
};

var levels = ["log", "debug", "error", "warn", "fatal"];

var outputs = function outputs(config) {
  return {
    log: function log() {
      return dispatchToTransports("log", config).apply(void 0, arguments);
    },
    debug: function debug() {
      return dispatchToTransports("debug", config).apply(void 0, arguments);
    },
    error: function error() {
      return dispatchToTransports("error", config).apply(void 0, arguments);
    },
    warn: function warn() {
      return dispatchToTransports("warn", config).apply(void 0, arguments);
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

var makeStyle = function makeStyle() {
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
      var metaArgs = typeof config.meta === "string" ? ["%c".concat(config.meta), makeStyle(config, config.meta)] : [config.meta.map(function (meta) {
        return "%c".concat(meta);
      }).join("")].concat(_toConsumableArray(config.meta.map(function (meta, i) {
        return makeStyle(config, config.meta[0], i);
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

var writerOutputEl = null;

var makeStyle$1 = function makeStyle() {
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

var transformConsoleArgs$1 = function transformConsoleArgs(config) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (config === undefined) return args;

    if (config.meta) {
      var metaArgs = typeof config.meta === "string" ? "<div style=\"".concat(makeStyle$1(config, config.meta), "\">").concat(config.meta, "</div>") : config.meta.map(function (meta, i) {
        return "<div style=\"".concat(makeStyle$1(config, config.meta[0], i), "\">").concat(meta, "</div>");
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

var isAvailableInEnvironment$1 = function isAvailableInEnvironment() {
  return window !== undefined && window.document !== undefined;
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
    var styleVal = Object.keys(style).map(function (cssProp) {
      return "".concat(cssProp, ":").concat(style[cssProp]);
    }).join(";");
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

  children && children.map(function (childEl) {
    el.appendChild(makeEl(childEl));
  });
  return el;
};

var initialise$1 = function initialise() {
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
        html: "•",
        style: {
          "align-self": "flex-end",
          "font-size": "20px",
          "line-height": "0.5pt"
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

var dispatch$1 = function dispatch(level, config) {
  return function () {
    var line = document.createElement("DIV");
    line.setAttribute("style", "margin-bottom:2px;".concat(lineStyles[level]));
    line.innerHTML = transformConsoleArgs$1(config).apply(void 0, arguments);
    writerOutputEl.append(line);
  };
};

var htmlDomTransport = {
  isAvailableInEnvironment: isAvailableInEnvironment$1,
  dispatch: dispatch$1,
  initialise: initialise$1
};

var lgrBrowser = function lgrBrowser() {
  registerTransport(consoleTransport);
  return lgr;
};

var demoObj = {
  a: "objects",
  b: "work",
  c: "too",
  success: true,
  someNumber: 123
};
var lgr$1 = lgrBrowser(); //console.log(lgr());

registerTransport(htmlDomTransport);
lgr$1.log("hello");
lgr$1.debug("world");
lgr$1.error("uh oh");
lgr$1.log(demoObj);
lgr$1({
  smile: true
}).debug("pass log config!");
lgr$1({
  timestamp: true
}).debug("pass log config!");
var myLogger = lgr$1({
  meta: "somelogger",
  timestamp: true
});
myLogger.debug("magic");
myLogger.debug("log");
myLogger.debug("formatting!");
myLogger.debug(demoObj);
var colorLogger = lgr$1({
  meta: ["colors!", "red ..."],
  backgroundColor: "#FF0000"
});
colorLogger.debug("color");
colorLogger.debug("me");
colorLogger.debug("happy");
colorLogger.debug(demoObj);
lgr$1({
  meta: ["a", "colors"]
}).log("random");
lgr$1({
  meta: ["b", "colors"]
}).log("colors");
lgr$1({
  meta: ["c", "colors"]
}).log("each");
lgr$1({
  meta: ["d", "colors"]
}).log("time");
