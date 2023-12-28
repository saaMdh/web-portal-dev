const { VuetifyPlugin } = require("webpack-plugin-vuetify");
// const VueI18nPlugin = require("@intlify/unplugin-vue-i18n/webpack");

const webpack = require("webpack");
const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const dotenv = require("dotenv");
const { DefinePlugin } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const path = require("path");
const glob = require("glob");
const last = require("lodash/last");

const VERSION = require("./package.json").version;
const dev = process.env.NODE_ENV !== "production";
const PUBLIC_PATH =
  process.env.NODE_SCRIPT !== "serve" && process.env.VUE_APP_ASSETS_PUBLIC_PATH
    ? process.env.VUE_APP_ASSETS_PUBLIC_PATH
    : "/";

function createWebpackConfig(browser_env) {
  const isLegacyBrowser = browser_env === "legacy";
  const versionPostfix = isLegacyBrowser ? "l" : "m";
  const distDir = isLegacyBrowser ? "dist/legacy" : "dist/modern";
  const mainFile = `src/main${isLegacyBrowser ? ".legacy" : ""}.js`;
  const transpileDependencies = isLegacyBrowser
    ? glob
        .sync("node_modules/*")
        .map(p => last(p.match(/(node_modules\/)(.*)/)))
    : [];

  const plugins = [
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"]
    }),
    new DefinePlugin({
      "process.env": JSON.stringify(dotenv.config().parsed)
    }),
    new VuetifyPlugin({ autoImport: true }),
  ];

  if (!dev) {
    plugins.push(
      // // Minify JavaScript
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        },
        extractComments: false
      }),
      // Gzip compression for assets
      new CompressionPlugin({
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
        threshold: 8192,
        deleteOriginalAssets: false
      })
    );
  }

  return defineConfig({
    publicPath: PUBLIC_PATH,
    outputDir: path.resolve(__dirname, distDir),
    productionSourceMap: dev,
    transpileDependencies: [
      "vuetify",
      "@ouedkniss/web-cart-plugin",
      "@ouedkniss/web-messenger-plugin",
      "@ouedkniss/web-analytics-plugin",
      "@ouedkniss/web-notification-plugin",
      "@ouedkniss/web-ui-plugin",
      "@vueuse/core",
      ...transpileDependencies
    ],
    devServer: {
      allowedHosts: "all",
      https: false,
      client: {
        overlay: false
      }
    },
    configureWebpack: {
      output: {
        filename: `js/[name].[contenthash].${VERSION}${versionPostfix}.js`,
        chunkFilename: `js/[name].[contenthash].${VERSION}${versionPostfix}.js`
      },
      plugins,
      module: {
        rules: [
          {
            test: /\.(graphql|gql)$/,
            loader: "graphql-tag/loader",
            exclude: /node_modules\/(?!(@ouedkniss)\/).*/
          }
        ]
      }
    },
    chainWebpack: config => {
      const mainConfig = config.entryPoints.store.get("main").parent;
      mainConfig.plugins.delete("prefetch-main");
      mainConfig.plugins.delete("logout-main");
      mainConfig.plugins.delete("connection-main");

      mainConfig.module
        .rule("vue")
        .use("vue-svg-inline-loader")
        .loader("vue-svg-inline-loader");

      mainConfig.module
        .rule("images")
        .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
        .use("image-webpack-loader")
        .loader("image-webpack-loader")
        .options({
          bypassOnDebug: true,
          disable: true
        })
        .end();

      mainConfig.plugin("define").tap(definitions => {
        Object.assign(definitions[0], {
          __VUE_I18N_FULL_INSTALL__: JSON.stringify(true),
          __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
          __VUE_I18N_LEGACY_API__: JSON.stringify(false)
        });

        return definitions;
      });
    },
    pluginOptions: {
      apollo: {
        lintGQL: false
      },
      i18n: {
        locale: "fr",
        fallbackLocale: "fr",
        localeDir: "locales",
        enableInSFC: true
      }
    },
    pages: {
      main: {
        entry: mainFile,
        template: "public/index.html",
        filename: "index.html",
        version: VERSION + "-" + versionPostfix
      },
      logout: {
        entry: "src/logout.js",
        template: "public/logout.html",
        filename: "logout.html"
      },
      connection: {
        entry: "src/connection.js",
        template: "public/connection.html",
        filename: "connection.html"
      }
    }
  });
}

module.exports = createWebpackConfig(process.env.BROWSERSLIST_ENV);
