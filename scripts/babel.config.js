module.exports = function(api) {
  api.cache(true);

  console.log("Babel Config");

  const presets = [
    [
      "@babel/preset-env",
      {
        modules: "auto"
      }
    ],
    "jest"
  ];

  const plugins = [
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ];

  return {
    presets,
    plugins
  };
};
