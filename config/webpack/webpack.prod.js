/*
 * Created on Tue Oct 18 2022
 *
 * Copyright (c) 2022 Philips
 * (C) Koninklijke Philips Electronics N.V. 2022 * * All rights are reserved.
 * Reproduction or transmission in whole or in part, in any form or by any
 * means, electronic, mechanical or otherwise, is prohibited without the prior
 * written consent of the copyright owner.
 */

const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin
const SourceMapDevToolPlugin = require("webpack").SourceMapDevToolPlugin
const CompressionPlugin = require("compression-webpack-plugin")
const dependencies = require("../../package.json").dependencies
const path = require("path")
const APP_NAME = "roccMfeTemplateApp"

module.exports = (env) => merge(common, {
  mode: "production",
  output: {
    publicPath: "auto",
    filename: "static/js/[name].[contenthash].js",
    chunkFilename: "static/js/[name].[contenthash].chunk.js",
    path: path.resolve(__dirname, "../../", "dist"),
  },
  optimization: {
    moduleIds: "deterministic",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  plugins: [
    new CompressionPlugin({
      algorithm: "gzip",
    }),
    new SourceMapDevToolPlugin({
      filename: env.publicPath + "[file].map",
      publicPath: "",
      exclude : [/node_modules.*/]
    }),
    new ModuleFederationPlugin({
      name: APP_NAME,
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App",
      },
      remotes: {
      },
      shared: {
        ...dependencies,
        react: {
          singleton: true,
          requiredVersion: dependencies.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"],
        },
        "semantic-ui-react": {
          singleton: true,
          requiredVersion: dependencies["semantic-ui-react"],
        },
        "@dls-pdv/semantic-react-components": {
          singleton: true,
          requiredVersion: dependencies["@dls-pdv/semantic-react-components"],
        },
        "@dls-pdv/semantic-ui-foundation": {
          singleton: true,
          requiredVersion: dependencies["@dls-pdv/semantic-ui-foundation"],
        }
      },
    }),
  ]
})
