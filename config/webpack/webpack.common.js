/*
 * Created on Fri Apr 30 2021
 *
 * Copyright (c) 2019 Philips
 * (C) Koninklijke Philips Electronics N.V. 2017 * * All rights are reserved.
 * Reproduction or transmission in whole or in part, in any form or by any
 * means, electronic, mechanical or otherwise, is prohibited without the prior
 * written consent of the copyright owner.
 */

const HtmlWebpackPlugin = require("html-webpack-plugin")
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const path = require("path")
const styleLoader = "style-loader"
const cssLoader = "css-loader"
const fileLoader = "file-loader"
const bundleLoader = "bundle-loader"
const babelLoader = "babel-loader"
const sassLoader = "sass-loader"

module.exports = {
  entry: "./src/index",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        oneOf: [{
          test: /\.wasm$/,
          type: "javascript/auto",
          loader: fileLoader,
          options: {
            name: "[name].[ext]",
            outputPath: path.join("static", "js"),
          },
        }],
      },
      {
        test: /bootstrap\.tsx$/,
        loader: bundleLoader,
        options: {
          lazy: true,
        },
      },
      {
        test: /\.tsx?$/,
        loader: babelLoader,
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react", "@babel/preset-typescript"],
        },
      },
      {
        test: /\.css$/,
        use: [
          styleLoader,
          {
            loader: cssLoader,
            options: {
              importLoaders: 1,
              modules: true
            }
          }
        ],
        include: /\.module\.css$/
      },
      {
        test: /\.css$/,
        use: [
          styleLoader,
          cssLoader
        ],
        exclude: /\.module\.css$/
      },
      {
        test: /\.(scss)$/,
        include: [path.resolve("src")],
        use: [
          {
            loader: styleLoader,
          },
          {
            loader: cssLoader,
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          {
            loader: sassLoader,
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|woff2|woff|ttf|eot)$/,
        use: [fileLoader]
      },
      {
        test: /\.(ico)$/,
        exclude: /node_modules/,
        use: ["file-loader?name=[name].[ext]"]
      },
    ],
  },
  plugins: [
    new WebpackBundleAnalyzer({ analyzerMode: "disabled", openAnalyzer: false }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.ico"
    }),
  ],
}
