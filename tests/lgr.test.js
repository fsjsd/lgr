import {
  lgr,
  lgrBrowser,
  consoleTransport,
  htmlDomTransport,
  registerTransport
} from "../src/exports";

it("renders without crashing", () => {
  const lgr = lgrBrowser();
  lgr.debug("hello");
});
