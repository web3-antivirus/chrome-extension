const fs = require("fs");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtensionReloader = require("webpack-extension-reloader");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// this block code is taken from config/path.js https://i.imgur.com/2iR9jTq.png
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
];

const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.tsx`);
};

const checkEnvVariables = (env) => {
  const { INJECT_FILE_NAME, BROWSER } = env;
  if (!INJECT_FILE_NAME || !BROWSER) throw new Error('Cannot configure webpack');
}

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      checkEnvVariables(process.env);
      const { INJECT_FILE_NAME, IS_WATCH, BROWSER } = process.env;
      const isEnvProduction = env === "production";
      // create in the path object a new property named inject
      // adding to it the path to the file, which will contain the code that will be inserted into external pages
      paths.inject = resolveModule(resolveApp, `src/${INJECT_FILE_NAME}`);
      // paths.appIndexJs - path to src/index.tsx file. It contains the code for PopUp https://i.imgur.com/FrL43rM.png
      // in dev environment we display these two files together
      // in a production environment, we will split the code into two different files. this is required by the api chrome extension
      // https://i.imgur.com/PxsDZWq.png
      webpackConfig.entry =
        isEnvProduction || IS_WATCH
          ? {
              main: paths.appIndexJs,
              inject: paths.inject,
              phishing: paths.appSrc + "/phishing.tsx",
              tracing: paths.appSrc + "/tracing.tsx",
            }
          : [paths.appIndexJs, paths.inject];

      // getting rid of hash in names in files after build https://i.imgur.com/sZEX7o2.png
      webpackConfig.output.filename = "static/js/[name].js";
      webpackConfig.output.chunkFilename = "static/js/[name].chunk.js";
      const MiniCssExtractPluginInstance = webpackConfig.plugins.find(
        (plugin) => plugin instanceof MiniCssExtractPlugin
      );

      if (MiniCssExtractPluginInstance) {
        MiniCssExtractPluginInstance.options.filename = "static/css/[name].css";
        MiniCssExtractPluginInstance.options.chunkFilename =
          "static/css/[name].chunk.css";
      }

      // it is necessary that during assembly the code from inject.js does not get into the code related to PopUp
      const HtmlWebpackPluginInstance = webpackConfig.plugins.find(
        (plugin) => plugin instanceof HtmlWebpackPlugin
      );
      HtmlWebpackPluginInstance.userOptions.excludeChunks = [INJECT_FILE_NAME];
      HtmlWebpackPluginInstance.userOptions.chunks = ["main"];

      if (IS_WATCH) {
        webpackConfig.plugins.push(new ExtensionReloader());
      }

      webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
          template: "./public/phishing.html",
          inject: true,
          chunks: ["phishing"],
          excludeChunks: [INJECT_FILE_NAME],
          filename: "./phishing.html", //relative to root of the application
        })
      );

      webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
          template: "./public/tracing.html",
          inject: true,
          chunks: ["tracing"],
          excludeChunks: [INJECT_FILE_NAME],
          filename: "./tracing.html", //relative to root of the application
        })
      );

      webpackConfig.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: "node_modules/webextension-polyfill/dist/browser-polyfill.js",
            },
            {
              from: `manifest/${BROWSER}`,
            },
          ],
        })
      );

      return webpackConfig;
    },
  },
};
