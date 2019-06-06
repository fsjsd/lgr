const htmlDomWriter = () => {
  const makeStyle = (backgroundColor = "black", color = "white") => {
    return `background-color:${backgroundColor};color:${color};border-radius:3px;padding:2px 4px;margin-left:2px;`;
  };
  const transformConsoleArgs = config => (...args) => {
    if (config === undefined) return args;

    if (config.meta) {
      const metaArgs =
        typeof config.meta === "string"
          ? [`%c${config.meta}%c${config.meta}`, makeStyle(), makeStyle()]
          : [
              config.meta.map(meta => `%c${meta}`).join(""),
              ...config.meta.map(meta => makeStyle())
            ];

      //console.log("ARGDEBUG", [...metaArgs, ...args]);

      return [...metaArgs, ...args];
    }

    return args;
  };

  return {
    isAvailableInEnvironment: () => {
      return window !== undefined && window.document !== undefined;
    },
    initialise: () => {
      // register DOM loaded, inject DIV and ref
      // element to inject log lines
    },
    dispatch: (level, config) => (...args) => {
      console[level](...transformConsoleArgs(config)(...args));
    }
  };
};

export default htmlDomWriter;
