module.exports = function (config) {
  config.set({
    frameworks: ["jasmine"],
    files: [

      "tests/**/*.spec.js"
    ],
    plugins: [
      require("karma-jasmine"),
      require("karma-jasmine-html-reporter"),
      require("karma-chrome-launcher")
    ],
    reporters: ["progress", "kjhtml"],
    browsers: ["ChromeHeadless"],
    singleRun: true,
    restartOnFileChange: false
  });
};