module.exports = function (config) {
  config.set({
    frameworks: ["jasmine"],

    files: [
      "/src/tests/**/*.karma.spec.jsx"
    ],

    preprocessors: {
      "/src/tests/**/*.karma.spec.jsx": ["webpack"]
    },

    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
          }
        ]
      },
      resolve: {
        extensions: [".js", ".jsx"]
      }
    },

    plugins: [
      require("karma-jasmine"),
      require("karma-jasmine-html-reporter"),
      require("karma-chrome-launcher"),
      require("karma-webpack")
    ],

    reporters: ["progress", "kjhtml"],

    browsers: ["ChromeHeadless"],

    singleRun: true,
    restartOnFileChange: false
  });
};