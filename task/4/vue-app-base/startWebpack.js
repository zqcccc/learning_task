const webpack = require('webpack')
const config = require('./webpack.prod')
const compiler = webpack(config)

compiler.run()