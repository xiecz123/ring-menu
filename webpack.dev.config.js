const path = require('path')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const base = require('./webpack.base.config')

module.exports = merge(base, {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].bundle.js'
  },
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{
        from: 'public'
        // to: 'dist',
        // flatten: true // 它只会拷贝文件，而不会把文件夹路径都拷贝上
        // toType: 'dir'
      }]
      // from: 'public/js/*.js',
      // to: path.resolve(__dirname, 'dist', 'js'),
      // ignore: publicCopyIgnore
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    // contentBase: './dist',
    port: '3000',
    stats: 'errors-only',
    hot: true
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: ['babel-loader'],
      //   exclude: /node_modules/
      // },
      {
        test: /\.(le|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240, // 10K
            esModule: false,
            name: '[name]_[contenthash:8].[ext]',
            outputPath: 'assets'
          }
        }],
        exclude: /node_modules/
      }
    ]
  }
})
