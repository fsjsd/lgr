import { getColor, getTimeStamp } from "../src/utils";

test("getColor tests", () => {
  let firstACol = "hsl(342, 70%, 45%)";
  let secondACol = "hsl(342, 70%, 60%)";
  let thirdACol = "hsl(342, 70%, 50%)";

  let colA = getColor("a", 0);
  expect(colA).toBe(firstACol);

  let colAagain = getColor("a", 0);
  expect(colAagain).toBe(colA); // should be same

  let colB = getColor("b", 0);
  expect(colB).not.toBe(colA); // should be different
  expect(colAagain).toBe(colA); // should still be same

  let colApos2 = getColor("a", 1);
  expect(colApos2).toBe(thirdACol); // 20% darker
});

test("getTimeStamp tests", () => {
  const timeStamp = getTimeStamp();
  expect(timeStamp.length).toBe(12);
});
