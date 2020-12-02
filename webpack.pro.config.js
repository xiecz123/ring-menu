const path = require('path')
const { merge } = require('webpack-merge')
const base = require('./webpack.base.config')

module.exports = merge(base, {
  entry: './src/Pie.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ringmenu.js',
    library: 'ringmenu',
    libraryTarget: 'umd'
  },
  mode: 'production'

})
