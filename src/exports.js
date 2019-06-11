import { lgr, registerWriterMiddleware } from "./lgr";
import consoleWriter from "./consoleWriter";
import htmlDomWriter from "./htmlDomWriter";

const lgrBrowser = () => {
  registerWriterMiddleware(consoleWriter);
  return lgr;
};

export default {
  lgr,
  lgrBrowser,
  htmlDomWriter,
  consoleWriter,
  registerWriterMiddleware
};
