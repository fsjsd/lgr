# lgr

magical javascript logger

- Colorize log statements by type!
- Extend output sources with middleware!

[![Edit lgr](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/lgr-6fxyr?fontsize=14)

## Installation

From your terminal:

> npm i fsjsd-lgr

### Prerequisites

None

## Usage

### Importing & Setup

For basic console logging, import lgrBrowser to get going:

> import { lgrBrowser } from "fsjsd-lgr";

invoke it to setup, and you're ready to log

> const logger = lgrBrowser();
> logger.debug("hello");
> logger.info("world");
> logger.error("whoops");

For other output writers, import lgr and registerWriterMiddleware to setup writers:

> import { lgr, consoleWriter, htmlDomWriter, registerWriterMiddleware } from "fsjsd-lgr";

register writer middleware first, then dispatch as before:

> registerWriterMiddleware(consoleWriter);
> registerWriterMiddleware(htmlDomWriter);
>
> lgr.debug("outputs to console and page");

### Magical logging options

Moden browser logging features work like objects, destructuring and object parameters:

> lgr.log(demoObj, { a, b }, someVal);



## Code your own log writer!

You can easily extend lgr to add your own outputs. Clone this repository and take a look at consoleWriter and htmlDomWriter to see how it's done.

Essentially, you need to implement three methods and export them:

> isAvailableInEnvironment() : bool

Called when your lgr is first used to establish whether the current environment can support your output mechanism. So if you're shipping isomorphic React for example, a fileSystemWriter would need to check whether it is running in node or the browser.

> initialise() : void

Also called on first use if isAvailableInEnvironment() returns true.

Use this to perform any one-time setup operations. For instance, htmlDomWriter implements this to mount a DOM element for log outputs to the page.

> dispatch()

dispatch is where you implement your logger. If should match this signature:

> const dispatch = (level, config) => (...args) => {
> ...
> }

**level** is the log level being called (log, debug, error, warn)

**config** contains any user confid settings passed to lgr as well as global settings. Use these to customise transformations to the arguments.

**args** are all logging arguments passed to lgr, as well as any injected arguments (e.g. timestamp) made globally by lgr.

If your use case is simple, just grab args and output them to your medium of choice. Remember args may contain objects as well as plain scalar values so you may decide to serialise (JSON.stringify) object and functions (toString) for readability. Consider log output size whatever your approach, and check the existing writers in the repo for examples of argument transforms.

## Deployment

lgr will automatically disable output in production builds where NODE_ENV === 'production'

if you're using consoleWriter, output will gracefully fail if window.console doesn't exist.

htmlDomWriter will also gracefully fail if window.document is unavailable.

## Authors

**Chris Webb** [fsjs.dev](https://fsjs.dev)

## License

This project is licensed under the MIT License

## Acknowledgments

- Somewhat inspired by the log4net project in .net
