'use strict';

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
  } //console.log("getColor", { value, pos, hue });
  //return `hsl(${hue}, 70%, ${45 + pos * 20}%)`;


  return "hsl(".concat(hue, ", 70%, ").concat(45 + 20 / 10 * pos, "%)");
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

var _lgr = null;

_lgr = function lgr() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    meta: []
  };

  var newLgr = function newLgr() {
    var newConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      meta: []
    };
    return _lgr(_objectSpread({}, config, newConfig, {
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

var transformConsoleArgs$1 = function transformConsoleArgs(config) {
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

var isAvailableInEnvironment$1 = function isAvailableInEnvironment() {
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
  return _lgr({});
};

// NOTE: Run npm run demo to build this to ../lib/demo.js
var demoObj = {
  a: "objects",
  b: "work",
  c: "too",
  success: true,
  someNumber: 123
};
var lgr = lgrBrowser(); //console.log(lgr());

registerTransport(htmlDomTransport);
lgr.log("hello");
lgr.debug("world");
lgr.error("uh oh");
lgr.log(demoObj);
lgr({
  smile: true
}).debug("pass log config!");
lgr({
  timestamp: true
}).debug("pass log config!");
var myLogger = lgr({
  meta: "somelogger",
  timestamp: true
});
myLogger.debug("magic");
myLogger.debug("log");
myLogger.debug("formatting!");
myLogger.debug(demoObj);
var colorLogger = lgr({
  meta: "colors!",
  backgroundColor: "#FF0000"
});
colorLogger.debug("color");
colorLogger.debug("me");
colorLogger.debug("happy");
colorLogger.debug(demoObj);
lgr({
  meta: "a"
})({
  meta: "color"
}).log("random");
lgr({
  meta: "b"
})({
  meta: "color"
}).log("colors");
lgr({
  meta: "c"
})({
  meta: "color"
}).log("each");
lgr({
  meta: "d"
})({
  meta: "color"
}).log("time");
lgr({
  meta: "1"
})({
  meta: "2"
})({
  meta: "3"
})({
  meta: "4"
})({
  meta: "5"
}).log("Auto-colors the more nesting you add");
/*
let lgr = null;

lgr = config => {
  var newLgr = newConfig =>
    lgr({ ...config, ...newConfig, meta: [...config.meta, ...newConfig.meta] });

  newLgr.debug = (...args) => console.log(config, ...args);

  return newLgr;
};

var baseLgr = lgr({ meta: "a" });
baseLgr.debug("base");
baseLgr({ meta: "b" })({ meta: "c" }).debug("base");
*/
