import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import minify from "rollup-plugin-babel-minify";

const NODE_ENV = process.env.NODE_ENV || "development";

let inputFile = "";
let outputFile = "";

switch (NODE_ENV) {
  case "demo":
    inputFile = "./demo/index.js";
    outputFile = "./lib/demo.js";
    break;
  case "production":
    inputFile = "./src/exports.js";
    outputFile = "./lib/prod.js";
    break;
  case "development":
  default:
    inputFile = "./src/exports.js";
    outputFile = "./lib/dev.js";
    break;
}

console.log("rollup", NODE_ENV, inputFile, outputFile);

export default {
  input: inputFile,
  output: {
    file: outputFile,
    format: "cjs"
  },
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
    }),
    babel({
      exclude: "node_modules/**"
    }),
    resolve(),
    commonjs(),
    minify()
  ],
  external: id => /^react/.test(id)
};
