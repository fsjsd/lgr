import sinon from "sinon";

/*
after(function() {
  sinon.restore();
});
*/

test("console to be mocked", () => {
  sinon.replace(console, "debug", sinon.fake());

  console.debug("log");

  expect(console.debug.calledWithMatch("log")).toBe(true);
});
