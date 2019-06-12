import { lgr, registerTransport } from "./lgr";
import consoleTransport from "./consoleTransport";
import htmlDomTransport from "./htmlDomTransport";

const lgrBrowser = () => {
  registerTransport(consoleTransport);
  return lgr;
};

export default {
  lgr,
  lgrBrowser,
  consoleTransport,
  htmlDomTransport,
  registerTransport
};
