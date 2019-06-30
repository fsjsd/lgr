import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import minify from "rollup-plugin-babel-minify";

const NODE_ENV = process.env.NODE_ENV || "development";

console.log("rollup", NODE_ENV);

export default {
  input: "./demo/index.js",
  output: {
    file: "./lib/demo.js",
    format: "cjs"
  },
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
    }),
    resolve(),
    commonjs(),
    babel({
      exclude: "node_modules/**"
    })
  ],
  external: id => /^react/.test(id)
};
