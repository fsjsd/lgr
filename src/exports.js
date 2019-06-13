import { lgr, registerTransport } from "./lgr";
import consoleTransport from "./transports/consoleTransport";
import htmlDomTransport from "./transports/htmlDomTransport";

const lgrBrowser = () => {
  registerTransport(consoleTransport);
  return lgr;
};

export {
  lgr,
  lgrBrowser,
  consoleTransport,
  htmlDomTransport,
  registerTransport
};
