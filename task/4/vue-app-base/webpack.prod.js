const { merge } = require('webpack-merge')
const config = require('./webpack.common.js')
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin') // 默认的 JS 压缩

module.exports = merge(config, {
  mode: 'production',
  devtool: false, // production 模式下不开启 source map
  optimization: { // 集中去配置 webpack 中的优化功能
    // 模块只导出被使用的成员
    usedExports: true, // 负责标记「枯树叶」
    // 压缩输出结果，将未引用的代码去除
    // minimize: true // 负责将「枯树叶」摇掉

    // 尽可能合并每一个模块到一个函数中
    concatenateModules: true, // 及提升了运行效率，又减少了代码的体积，也叫 Scope Hoisting，是在 webpack3 添加的特性
    minimize: true,
    minimizer: [ // 如果没有开启压缩的话，就不会用到这里配置的插件
      // 这个配置也有个缺点，就是会覆盖默认的压缩行为，导致原来的 JS 需要再去指定用什么压缩
      new TerserWebpackPlugin(),
      new OptimizeCssAssetsWebpackPlugin() // 如果配置到 plugins 中的话就是每次都要压缩 css 文件了
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
        },
      ],
    }),
  ]
})