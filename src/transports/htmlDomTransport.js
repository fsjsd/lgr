import { getColor } from "../utils";

let writerOutputEl = null;

const makeLogStyle = (
  { backgroundColor = null, color = "white" } = {},
  meta = "",
  i = 0
) => {
  const bgColor =
    backgroundColor === null ? getColor(meta, i) : backgroundColor;
  return `display:inline-block;background-color:${bgColor};color:${color};border-radius:3px;padding:2px 4px;margin-left:2px;`;
};

const transformConsoleArgs = config => (...args) => {
  if (config === undefined) return args;

  if (config.meta) {
    const metaArgs =
      typeof config.meta === "string"
        ? `<div style="${makeLogStyle(config, config.meta)}">${
            config.meta
          }</div>`
        : config.meta
            .map(
              (meta, i) =>
                `<div style="${makeLogStyle(
                  config,
                  config.meta[0],
                  i
                )}">${meta}</div>`
            )
            .join("");

    //console.log("ARGDEBUG", [...metaArgs, ...args]);

    return [metaArgs, ...args].join(" ");
  }

  return args;
};

const lineStyles = {
  log: "",
  debug: "color:blue",
  error: "color:red",
  warn: "color:orange"
};

const isAvailableInEnvironment = () => {
  return window !== undefined && window.document !== undefined;
};

const makeStyle = styles => {
  return Object.keys(styles)
    .map(cssProp => `${cssProp}:${styles[cssProp]}`)
    .join(";");
};

const makeEl = ({ tag, style, attrs, html, children, refOut, events } = {}) => {
  let el = document.createElement(tag);

  if (html) {
    el.innerHTML = html;
  }

  if (style) {
    let styleVal = makeStyle(style);
    el.setAttribute("style", styleVal);
  }

  if (refOut) {
    //console.log("refOut", el);
    refOut(el);
  }

  if (attrs) {
    for (let attr in attrs) {
      let attrVal = attrs[attr];
      el.setAttribute(attr, attrVal);
    }
  }

  if (events) {
    for (let ev in events) {
      el.addEventListener(ev, events[ev]);
    }
  }

  children &&
    children.map(childEl => {
      el.appendChild(makeEl(childEl));
    });

  return el;
};

const initialise = () => {
  let existingOutput = document.getElementById("lgr_html_dom_writer__");

  // don't remount
  if (existingOutput) {
    return;
  }

  //writerOutputEl;
  const wrapper = makeEl({
    tag: "DIV", // WRAPPER
    attrs: {
      id: "lgr_html_dom_writer__",
      draggable: "draggable"
    },
    style: {
      display: "flex",
      "flex-direction": "column",
      position: "fixed",
      width: "400px",
      top: "300px",
      "background-color": "rgba(255,255,255,0.9)",
      bottom: "0px",
      right: "0px",
      overflow: "hidden",
      border: "solid 1px #007fe0",
      "font-size": "12px",
      "font-family": "Helvetica, arial"
    },
    children: [
      {
        tag: "DIV", // HEADER
        style: {
          color: "white",
          display: "flex",
          "flex-direction": "row",
          "background-color": "#007fe0",
          padding: "10px",
          "font-size": "12px"
        },
        children: [
          {
            tag: "DIV",
            html: "lgr",
            style: {
              "flex-grow": "2"
            }
          },
          {
            tag: "DIV",
            html: "&#0149;",
            style: {
              "align-self": "flex-end",
              "font-size": "20px",
              "line-height": "0.5pt",
              height: "14px",
              "letter-spacing": "0.5pt"
            },
            events: {
              click: () => {
                writerOutputEl.innerHTML = "ACCESS";
              }
            }
          }
        ]
      },
      {
        tag: "DIV", // CONTENT
        refOut: el => {
          writerOutputEl = el;
        },
        style: {
          "flex-grow": 2,
          padding: "10px",
          overflow: "scroll"
        }
      }
    ]
  });

  //console.log("wrapper", wrapper);

  document.body.appendChild(wrapper);
};

const dispatch = (level, config) => (...args) => {
  let line = document.createElement("DIV");
  line.setAttribute("style", `margin-bottom:2px;${lineStyles[level]}`);
  line.innerHTML = transformConsoleArgs(config)(...args);
  writerOutputEl.append(line);
};

export default { isAvailableInEnvironment, dispatch, initialise };
