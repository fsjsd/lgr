import { lgr, registerTransport, clearTransports } from "./lgr";
import consoleTransport from "./transports/consoleTransport";
import nodeTransport from "./transports/nodeTransport";
import htmlDomTransport from "./transports/htmlDomTransport";

const lgrBrowser = () => {
  registerTransport(consoleTransport);
  return lgr({});
};

const lgrNode = () => {
  registerTransport(nodeTransport);
  return lgr({});
};

export {
  lgr,
  lgrBrowser,
  lgrNode,
  consoleTransport,
  htmlDomTransport,
  nodeTransport,
  registerTransport,
  clearTransports
};
