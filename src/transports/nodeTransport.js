const terminalColors = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m"
};

// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color

const makeLogStyle = (
  { backgroundColor = null, color = "white" } = {},
  meta = "",
  i = 0
) => {
  //const fontsize = `$1.${5 * i}rem`;
  const bgColor =
    backgroundColor === null ? getColor(meta, i) : backgroundColor;
  return `${bgColor} `;
};

//\x1b[36m%s\x1b[0m

const colorLookup = col => {
  return col in terminalColors ? terminalColors[col] : terminalColors.FgGreen;
};

const transformConsoleArgs = config => (...args) => {
  if (config === undefined) return args;

  // TODO: This needs work!

  if (config.meta) {
    const metaArgs =
      typeof config.meta === "string"
        ? [`${colorLookup(config.color)}%s${terminalColors.Reset}`, config.meta]
        : config.meta.reduce(
            (acc, curr) => [
              ...acc,
              `${colorLookup(config.color)}%s${terminalColors.Reset}`,
              curr
            ],
            []
          );
    //console.log("ARGDEBUG", [...metaArgs, ...args]);

    return [...metaArgs, ...args];
  }

  return args;
};

const isAvailableInEnvironment = () => {
  return console !== undefined;
};

const dispatch = (level, config) => (...args) => {
  console[level](...transformConsoleArgs(config)(...args));
};

const initialise = () => {};

export default { isAvailableInEnvironment, dispatch, initialise };
