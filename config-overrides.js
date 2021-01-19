const { override, addWebpackAlias, useBabelRc, useEslintRc } = require('customize-cra')
const WebpackBar = require('webpackbar')
// const webpack = require('webpack')

const addOptimizedPlugin = () => config => {
  if (process.env.NODE_ENV === 'development') {
    Object.assign(config, {
      devServer: {
        hot: true,
        hotOnly: true
      }
    })
  } else {
    Object.assign(config, {
      devtool: ``
    })
  }
  return config
}


const addProgressBarPlugin = () => config => {
  config.plugins.push(
    new WebpackBar()
  )
  return config
}

module.exports = override(
  addProgressBarPlugin(),
  // addWebpackModuleRule({
  //   test: /\.js$/,
  //   exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
  //   loader: 'babel-loader',
  // }),
  // addWebpackPlugin(
  //   new webpack.ProvidePlugin({
  //     'window.Quill': 'quill'
  //   })
  // )
  addWebpackAlias({
    'react-dom': '@hot-loader/react-dom'
  }),
  useEslintRc(),
  useBabelRc(),
  addOptimizedPlugin()
)