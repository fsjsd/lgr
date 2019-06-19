// jest.config.js
module.exports = {
  verbose: true,
  moduleFileExtensions: ["js", "jsx"],
  moduleDirectories: ["node_modules"],
  transform: {
    "\\.js$": "babel-jest"
  },
  rootDir: "../",
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/scripts/**",
    "!**/lib/**",
    "!**/demo/**"
  ],
  coverageReporters: ["text", "text-summary", "json", "html"]
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
