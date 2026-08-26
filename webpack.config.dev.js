const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/index\/?$/, to: '/index.html' },
        { from: /^\/merch\/?$/, to: '/merch.html' },
        { from: /^\/impressum\/?$/, to: '/impressum.html' },
        { from: /^\/geheim\/?$/, to: '/geheim.html' },
        { from: /^\/gif\/?$/, to: '/gif.html' },
        { from: /^\/FrequencyHub\/?$/, to: '/FrequencyHub.html' },
        { from: /^\/Display\/?$/, to: '/Display.html' },
        { from: /^\/modwwdw\/?$/, to: '/modwwdw.html' },
      ],
    },
    static: {
      directory: path.resolve(__dirname),
      watch: {
        ignored: [
          /[\\/]\.vs([\\/]|$)/,
          /[\\/]node_modules([\\/]|$)/,
          /[\\/]\.git([\\/]|$)/,
        ],
      },
    },
  },
});
