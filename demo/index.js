import { lgrBrowser, registerTransport } from "../lib/lgr";
import htmlDomTransport from "../lib/htmlDomTransport";

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

let myLogger = lgr({ meta: "somelogger" });
myLogger.debug("magic");
myLogger.debug("log");
myLogger.debug("formatting!");
myLogger.debug(demoObj);

let colorLogger = lgr({
  meta: ["colors!", "red ..."],
  backgroundColor: "#FF0000"
});
colorLogger.debug("color");
colorLogger.debug("me");
colorLogger.debug("happy");
colorLogger.debug(demoObj);
