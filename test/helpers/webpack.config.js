var path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.rgl', '.js'],
    alias: {
      regularjs: path.resolve(
        __dirname,
        '../../lib/index.js'
      )
    },
    modules: [path.resolve(__dirname, 'test/files'), 'node_modules']
  },
  devtool: false,
  plugins: [
    new ExtractTextPlugin('static/css/' + '[name]' + '.wxss'),
  ],
  module: {
    rules: [
    {
      test: /\.rgl$/,
      use: {
        loader: 'mpregular-loader',
        options: {
          loaders: {
            css: ExtractTextPlugin.extract({
              use: 'css-loader',
              fallback: 'style-loader',
            }),
            less: ExtractTextPlugin.extract({
              use: ['css-loader', 'less-loader'],
              fallback: 'style-loader',
            }),
            mcss: ExtractTextPlugin.extract({
              use: ['css-loader', 'mcss-loader'],
              fallback: 'style-loader',
            }),
          },
        },
      }
    },
    {
      test: /\.js$/,
      use: [
        'babel-loader',
        {
          loader: 'mpregular-loader',
          options: {
            checkEntry: true,
          },
        },
      ]
    }]
  },
}