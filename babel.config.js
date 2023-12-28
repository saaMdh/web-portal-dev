const { getBrowserslistQueries } = require("bdsl-webpack-plugin");

const env = process.env.BROWSERSLIST_ENV;
module.exports = {
  plugins: ["lodash", "date-fns"],
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      {
        useBuiltIns: "entry",
        targets: { browsers: getBrowserslistQueries({ env }) },
      }
    ]
  ]
};
