import {
  lgr,
  lgrBrowser,
  clearTransports,
  registerTransport,
  consoleTransport,
  htmlDomTransport
} from "../src/exports";

import { getColor, getTimeStamp } from "../src/utils";

test("no transports throws error", () => {
  clearTransports();
  expect.hasAssertions();
  try {
    lgr({}).debug("test");
  } catch (e) {
    expect(e).toEqual(new Error("lgr: No logging transports defined"));
  }
});

test("Basic logging does not throw error", () => {
  clearTransports();
  const lgr = lgrBrowser();
  lgr.debug("hello");
  lgr.warn("hello");
  lgr.error("hello");
  lgr.log("hello");
});

const consoleDuckPunch = outFn => {
  console.debug = (...args) => {
    outFn(...args);
  };
};

test("Expected output - simple statement", () => {
  expect.hasAssertions();
  clearTransports();
  consoleDuckPunch((...args) => {
    expect(args[0]).toBe("hello");
  });
  const lgr = lgrBrowser();
  lgr.debug("hello");
});

test("Expected output - smile", () => {
  expect.hasAssertions();
  clearTransports();
  consoleDuckPunch((...args) => {
    expect(args[2]).toBe(":)");
    expect(args[3]).toBe("hello");
  });
  const lgr = lgrBrowser();
  lgr({ smile: true }).debug("hello");
});

test("Expected output - timestamp", () => {
  expect.hasAssertions();
  clearTransports();
  consoleDuckPunch((...args) => {
    // timestamp trimmed to remove milliseconds for test case - we want to
    // test the timestamp format was successfully prepended to the output
    // args
    expect(args[2].substr(0, 8)).toBe(getTimeStamp().substr(0, 8));
    expect(args[3]).toBe("hello");
  });
  const lgr = lgrBrowser();
  lgr({ timestamp: true }).debug("hello");
});

test("Expected output - meta, hard coded color", () => {
  expect.hasAssertions();
  clearTransports();

  const metaLabel = "myCategory";
  const metaColor = "#FF0000";

  consoleDuckPunch((...args) => {
    console.log(args);
    expect(args[0]).toBe(`%c${metaLabel}`);
    expect(args[2]).toBe("hello");
  });
  const lgr = lgrBrowser();
  lgr({ meta: metaLabel, backgroundColor: metaColor }).debug("hello");
});

test("Expected output - meta x2, hard coded color", () => {
  expect.hasAssertions();
  clearTransports();

  const metaLabel = "myCategory";
  const metaLabel2 = "myCategory2";
  const metaColor = "#FF0000";

  consoleDuckPunch((...args) => {
    console.log(args);
    expect(args[0]).toBe(`%c${metaLabel}%c${metaLabel2}`);
    expect(args[3]).toBe("hello");
  });
  const lgr = lgrBrowser();
  lgr({ meta: metaLabel, backgroundColor: metaColor })({
    meta: metaLabel2
  }).debug("hello");
});

test("Mock - recursive function interface", () => {});
