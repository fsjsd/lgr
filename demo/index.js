// NOTE: Run npm run demo to build this to ../lib/demo.js

import {
  lgrBrowser,
  htmlDomTransport,
  registerTransport
} from "../src/exports";

let demoObj = {
  a: "objects",
  b: "work",
  c: "too",
  success: true,
  someNumber: 123
};

let lgr = lgrBrowser();

//console.log(lgr());

registerTransport(htmlDomTransport);

lgr.log("hello");
lgr.debug("world");
lgr.error("uh oh");
lgr.log(demoObj);
lgr({ smile: true }).debug("pass log config!");
lgr({ timestamp: true }).debug("pass log config!");

let myLogger = lgr({ meta: "somelogger", timestamp: true });
myLogger.debug("magic");
myLogger.debug("log");
myLogger.debug("formatting!");
myLogger.debug(demoObj);

let colorLogger = lgr({
  meta: "colors!",
  backgroundColor: "#FF0000"
});
colorLogger.debug("color");
colorLogger.debug("me");
colorLogger.debug("happy");
colorLogger.debug(demoObj);

lgr({ meta: "a" })({ meta: "color" }).log("random");
lgr({ meta: "b" })({ meta: "color" }).log("colors");
lgr({ meta: "c" })({ meta: "color" }).log("each");
lgr({ meta: "d" })({ meta: "color" }).log("time");

lgr({ meta: "1" })({ meta: "2" })({ meta: "3" })({ meta: "4" })({
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
