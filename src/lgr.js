import consoleWriter from "./consoleWriter";
import htmlDomWriter from "./htmlDomWriter";

const globalConfig = { disabled: false, disableInProduction: true };

const writerMiddlewares = [];

const registerWriterMiddleware = middleware => {
  if (
    !globalConfig.disabled &&
    !(
      globalConfig.disableInProduction &&
      process &&
      process.env &&
      process.env.NODE_ENV == "production"
    ) &&
    middleware.isAvailableInEnvironment(globalConfig)
  ) {
    middleware.initialise();
    writerMiddlewares.push(middleware);
  }
};

// args transform routine. This can be extended
// with common/shared behaviours, but be mindful
// whether individual writers can support shared
// implementations
const transformArgs = config => (...args) => {
  if (config === undefined) return args;

  if (config.smile) {
    return [":)", ...args];
  }

  // untouched
  return args;
};

// enumerate writers and call the log method on each, applying
// default transforms to args before each writer manipulates further
const dispatchToWriters = (level, config) => (...args) => {
  // this is essentially compose()
  writerMiddlewares.map(writer =>
    writer.dispatch(level, config)(...transformArgs(config)(...args))
  );
};

const levels = ["log", "debug", "error", "warn", "fatal"];

const outputs = function(config) {
  return {
    log: (...args) => dispatchToWriters("log", config)(...args),
    debug: (...args) => dispatchToWriters("debug", config)(...args),
    error: (...args) => dispatchToWriters("error", config)(...args),
    warn: (...args) => dispatchToWriters("warn", config)(...args)
  };
};

// declare 'base' logger as a higher order function accepting config
// as a pass-through argument
const loggerBase = config => outputs(config);

// but attach each log method as direct methods onto the base function itself
// so each method can be called directly on the function itself it there is
// no config to pass through
levels.map(
  level => (loggerBase[level] = (...args) => outputs()[level](...args))
);

const lgrBrowser = () => {
  registerWriterMiddleware(consoleWriter);
  return loggerBase;
};

export { registerWriterMiddleware, lgrBrowser };
export default loggerBase;
