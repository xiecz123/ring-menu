const path = require('path')
const webpack = require('webpack')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const Manifest = require('webpack-manifest-plugin') 这个插件还不支持webpackv5
const isDev = process.env.NODE_ENV === 'development'

function resolve (dir) {
  return path.resolve(__dirname, dir)
}

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'ringMenu.js', // '[name].[contenthash:8].bundle.js',
    path: resolve('dist')
    // library: 'ringMenu',
    // libraryTarget: 'umd'
  },
  mode: isDev ? 'development' : 'production',
  target: 'web', // 这是默认的值
  resolve: {
    extensions: ['.js', '.json', '.css'],
    alias: {
      '@': resolve('src')
    }
  },
  cache: {
    type: 'filesystem' // 将缓存放在文件系统中
  },
  // 从输出的 bundle 中排除依赖
  externals: {
    zrender: 'zrender'
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] // 不删除dll目录下的文件
    }),
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
    // new Manifest(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    // contentBase: './dist',
    port: '3000',
    stats: 'errors-only',
    hot: true
  },
  devtool: 'cheap-module-source-map',
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
}
