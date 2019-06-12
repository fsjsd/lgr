const globalConfig = { disabled: false, disableInProduction: true };

const transports = [];

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
    return [new Date().toTimeString(), ...args];
  }

  // untouched
  return args;
};

// enumerate transports and call the log method on each, applying
// default transforms to args before each writer manipulates further
const dispatchToTransports = (level, config) => (...args) => {
  // this is essentially compose()
  transports.map(transport =>
    transport.dispatch(level, config)(...transformArgs(config)(...args))
  );
};

const levels = ["log", "debug", "error", "warn", "fatal"];

const outputs = function(config) {
  return {
    log: (...args) => dispatchToTransports("log", config)(...args),
    debug: (...args) => dispatchToTransports("debug", config)(...args),
    error: (...args) => dispatchToTransports("error", config)(...args),
    warn: (...args) => dispatchToTransports("warn", config)(...args)
  };
};

// declare 'base' logger as a higher order function accepting config
// as a pass-through argument
const lgr = config => outputs(config);

// but attach each log method as direct methods onto the base function itself
// so each method can be called directly on the function itself it there is
// no config to pass through
levels.map(level => (lgr[level] = (...args) => outputs()[level](...args)));

export { lgr, registerTransport };
