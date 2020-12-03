const path = require('path')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')

const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
// const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  resolve: {
    extensions: ['.js', '.json', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src')
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
    new WebpackManifestPlugin()
  ]
}
