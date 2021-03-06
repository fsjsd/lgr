import { getColor } from "../utils";

const makeLogStyle = (
  { backgroundColor = null, color = "white" } = {},
  meta = "",
  i = 0
) => {
  //const fontsize = `$1.${5 * i}rem`;
  const fontsize = `$1.5rem`;
  const bgColor =
    backgroundColor === null ? getColor(meta, i) : backgroundColor;
  return `background-color:${bgColor};color:${color};border-radius:3px;padding:2px 4px;margin-left:2px;font-size:${fontsize};font-weight:${
    i === 0 ? "bold" : "normal"
  }`;
};

const transformConsoleArgs = config => (...args) => {
  if (config === undefined) return args;

  if (config.meta) {
    const metaArgs =
      typeof config.meta === "string"
        ? [`%c${config.meta}`, makeLogStyle(config, config.meta)]
        : [
            config.meta.map(meta => `%c${meta}`).join(""),
            ...config.meta.map((meta, i) =>
              makeLogStyle(config, config.meta[0], i)
            )
          ];

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
