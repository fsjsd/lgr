// jest.config.js
module.exports = {
  verbose: true,
  moduleFileExtensions: ["js", "jsx"],
  moduleDirectories: ["node_modules"],
  transform: {
    "\\.js$": "babel-jest"
  },
  roots: ["../tests"]
};

/* required babel config:

{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": "auto"
      }
    ],
    "jest"
  ],
  "plugins": []
}
*/
