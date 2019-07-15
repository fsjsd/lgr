// with credit to Martin Ankerl for the idea to use the golden ratio
// to select distinct hues from around the hue wheel.
// https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/

// # use golden ratio
const golden_ratio_conjugate = 0.618033988749895;

//let h = Math.random(); // # use random start value
let h = 0.333;

const generateBestHue = () => {
  h += golden_ratio_conjugate;
  h %= 1;
  const hue = Math.floor(360 * h);
  return hue;
};

const getColorPair = () => {
  //const color = `hsl(${hue}, 80%, 50%)`;
  //console.log(`%ccolor`, `color:(${color}`);
  let hue = generateBestHue();

  return [`hsl(${hue}, 80%, 50%)`, `hsl(${hue}, 60%, 50%)`];
};

const colorMapCache = {};

const getColor = (value, pos) => {
  let hue = colorMapCache[value];
  if (hue === undefined) {
    hue = generateBestHue();
    colorMapCache[value] = hue;
  }
  /*
  0 = 0     20
  1 = 10    10
  2 = 15    5
  3 = 17    
  n = 20
  */
  //console.log("getColor", { value, pos, hue });
  //return `hsl(${hue}, 70%, ${45 + pos * 20}%)`;
  return `hsl(${hue}, 70%, ${45 + pos * 5}%)`;
};

const getTimeStamp = () => {
  /*
  getHours() - Returns the hour of the day (0-23).
  getMinutes() - Returns the minute (0-59).
  getSeconds() - Returns the second (0-59).
  getMilliseconds() - Returns the milliseconds (0-999).
  */
  let now = new Date();
  return `${now
    .getHours()
    .toString()
    .padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${now
    .getSeconds()
    .toString()
    .padStart(2, "0")}.${now.getMilliseconds()}`;
};

export { getColor, getTimeStamp };
