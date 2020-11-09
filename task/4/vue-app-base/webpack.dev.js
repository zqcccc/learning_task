const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const config = require('./webpack.common.js')

module.exports = merge(config, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: [
      path.resolve(__dirname, 'public'),
      path.join(__dirname, 'dist'),
    ],
    open: true,
    port: 9988,
    hotOnly: true
  },
  plugins: [
    //热更新
    new webpack.HotModuleReplacementPlugin()
  ]
})