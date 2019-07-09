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
    lgr.debug("test");
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
    expect(args[0]).toBe(":)");
    expect(args[1]).toBe("hello");
  });
  const lgr = lgrBrowser();
  lgr({ smile: true }).debug("hello");
});

test("Expected output - timestamp", () => {
  expect.hasAssertions();
  clearTransports();
  consoleDuckPunch((...args) => {
    // TODO: trim this it will fail if millisecond
    // gets sliced during op
    let timestamp = getTimeStamp();
    expect(args[0]).toBe(timestamp);
    expect(args[1]).toBe("hello");
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
  lgr({ meta: [metaLabel, metaLabel2], backgroundColor: metaColor }).debug(
    "hello"
  );
});

test("Mock - recursive function interface", () => {});
