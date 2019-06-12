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

var globalConfig = {
  disabled: false,
  disableInProduction: true
};
var writerMiddlewares = [];

var registerWriterMiddleware = function registerWriterMiddleware(middleware) {
  if (!globalConfig.disabled && !(globalConfig.disableInProduction && process && process.env && "development" === "production") && middleware.isAvailableInEnvironment(globalConfig)) {
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
    }

    if (config.timestamp) {
      return [new Date().toTimeString()].concat(args);
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

var makeStyle = function makeStyle() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$backgroundColor = _ref.backgroundColor,
      backgroundColor = _ref$backgroundColor === void 0 ? "black" : _ref$backgroundColor,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? "white" : _ref$color;

  var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var fontsize = "$1.".concat(5 * i, "rem");

  return "background-color:".concat(backgroundColor, ";color:").concat(color, ";border-radius:3px;padding:2px 4px;margin-left:2px;font-size:").concat(fontsize, ";font-weight:").concat(i === 0 ? "bold" : "normal");
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
      }).join("")].concat(_toConsumableArray(config.meta.map(function (meta, i) {
        return makeStyle(config, i);
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

var writerOutputEl = null;

var makeStyle$1 = function makeStyle() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$backgroundColor = _ref.backgroundColor,
      backgroundColor = _ref$backgroundColor === void 0 ? "black" : _ref$backgroundColor,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? "white" : _ref$color;
  return "display:inline-block;background-color:".concat(backgroundColor, ";color:").concat(color, ";border-radius:3px;padding:2px 4px;margin-left:2px;");
};

var transformConsoleArgs$1 = function transformConsoleArgs(config) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (config === undefined) return args;

    if (config.meta) {
      var metaArgs = typeof config.meta === "string" ? "<div style=\"".concat(makeStyle$1(), "\">").concat(config.meta, "</div>") : config.meta.map(function (meta) {
        return "<div style=\"".concat(makeStyle$1(config), "\">").concat(meta, "</div>");
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
      "font-size": "12px"
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

var htmlDomWriter = {
  isAvailableInEnvironment: isAvailableInEnvironment$1,
  dispatch: dispatch$1,
  initialise: initialise$1
};

var lgrBrowser = function lgrBrowser() {
  registerWriterMiddleware(consoleWriter);
  return lgr;
};

var exports$1 = {
  lgr: lgr,
  lgrBrowser: lgrBrowser,
  htmlDomWriter: htmlDomWriter,
  consoleWriter: consoleWriter,
  registerWriterMiddleware: registerWriterMiddleware
};

module.exports = exports$1;
