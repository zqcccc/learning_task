const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  context: path.resolve(__dirname),
  entry: path.join(__dirname, './src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    // filename: '[name]-[contenthash:8].bundle.js',
    // chunkFilename: '[name]-[contenthash:8].js',
    publicPath: ''
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              esModule: false,
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              esModule: false,
            }
          },
          'less-loader',
        ]
      },
      // {
      //   test: /\.m?js/, resolve: {
      //     fullySpecified: false
      //   }
      // },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 10 * 1024, // 10 KB
          },
        }
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      url: '/',
      title: 'hello world',
      template: 'public/index.html'
    }),
    // new webpack.DefinePlugin({
    //   BASE_URL: '"/"'
    // }),
    // new webpack.ProvidePlugin({
    //   process: 'process/browser',
    // }),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ]
}