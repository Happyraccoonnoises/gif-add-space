const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const htmlPages = [
  'index.html',
  'merch.html',
  'impressum.html',
  'geheim.php',
  'gif.html',
  'FrequencyHub.html',
  'Display.html',
  'modwwdw.html',
  '404.html',
];

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    ...htmlPages.map((page) => new HtmlWebpackPlugin({
      template: `./${page}`,
      filename: page,
      inject: false,
    })),
    new CopyPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: 'css', to: 'css' },
        { from: 'js/landing.js', to: 'js/landing.js' },
        { from: 'js/weticketapi fetch.js', to: 'js/weticketapi fetch.js' },
        { from: 'icon.svg', to: 'icon.svg' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'robots.txt', to: 'robots.txt' },
        { from: 'icon.png', to: 'icon.png' },
        { from: 'site.webmanifest', to: 'site.webmanifest' },
        { from: '.htaccess', to: '.htaccess', toType: 'file' },
      ],
    }),
  ],
});
