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
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin")
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const path = require("path")
const dependencies = require("../../package.json").dependencies
const APP_NAME = "roccMfeTemplateApp"

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3015,
    hot: true,
    liveReload: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  optimization: {
    minimize: false,
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, "../../", "dist"),
    publicPath: "auto",
  },
  plugins: [
    new ExternalTemplateRemotesPlugin(),
    new ReactRefreshWebpackPlugin({
      exclude: [/node_modules/, /bootstrap\.js$/],
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
