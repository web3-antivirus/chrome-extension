const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env) => {
  if (!env.BROWSER) throw new Error("BROWSER is not defined");
  return {
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
      }],
    }),
    new Dotenv({
			path: `environments/.env.${env.BROWSER}`
		}),
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                noEmit: false,
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  devtool: "cheap-module-source-map",
}};
