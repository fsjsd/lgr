import { getTimeStamp } from "./utils";

const globalConfig = { disabled: false, disableInProduction: true };

const transports = [];

const clearTransports = () => {
  transports.length = 0;
};

const registerTransport = transport => {
  if (
    !globalConfig.disabled &&
    !(
      globalConfig.disableInProduction &&
      process &&
      process.env &&
      process.env.NODE_ENV === "production"
    ) &&
    transport.isAvailableInEnvironment(globalConfig)
  ) {
    transport.initialise();
    transports.push(transport);
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

  if (config.timestamp) {
    return [getTimeStamp(), ...args];
  }

  // untouched
  return args;
};

// enumerate transports and call the log method on each, applying
// default transforms to args before each writer manipulates further
const dispatchToTransports = (level, config) => (...args) => {
  if (process.env.NODE_ENV !== "production" && transports.length === 0) {
    throw new Error("lgr: No logging transports defined");
  }
  // this is essentially compose()
  transports.map(transport =>
    transport.dispatch(level, config)(...transformArgs(config)(...args))
  );
};

const levels = ["log", "debug", "error", "warn", "fatal"];

let lgr = null;

// recursion routine to allow config args to be progressively built up
// by sub routines so lgr(..cnf)(..cnf)(..cnf).debug(...)
lgr = (config = { meta: [] }) => {
  var newLgr = (newConfig = { meta: [] }) =>
    lgr({
      ...config,
      ...newConfig,
      meta: [...(config.meta || []), newConfig.meta || []]
    });

  levels.map(
    level =>
      (newLgr[level] = (...args) =>
        dispatchToTransports(level, config)(...args))
  );

  return newLgr;
};

export { lgr, registerTransport, clearTransports };
