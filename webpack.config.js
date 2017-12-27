// test
// https://github.com/toddmotto/angular-lazy-load-demo

var path = require('path');
var fs = require('fs');

var webpack = require('webpack');
var server = require('webpack-dev-server');
var chalk = require('chalk');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var jsonServer = require('json-server');
var { AotPlugin } = require('@ngtools/webpack');
var cwd = process.cwd();

module.exports = {
  cache: true,
  context: cwd,
  performance: {
    hints: false
  },
  devServer: {
    contentBase: cwd,
    compress: true,
    inline: true,
    hot: true,
    port: 4000,
    publicPath: '/build/',
    quiet: true,
    historyApiFallback: true,
    setup: function (app) {
      app.use('/api', jsonServer.router('db.json'));
    },
    stats: {
      chunks: false,
      chunkModules: false
    }
  },
  devtool: 'sourcemap',
  entry: {
    app: [
      'reflect-metadata',
      'ts-helpers',
      'zone.js',
      'main'
    ]
  },
  output: {
    chunkFilename: '[name].chunk.js',
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build/',
    sourceMapFilename: '[name].map'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular-router-loader',
          'angular2-template-loader'
        ]
      },
      {
        test: /\.html/,
        loader: 'raw-loader'
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'raw-loader'
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  node: {
    fs: 'empty',
    global: true,
    crypto: 'empty'
  },
  plugins: [
    new AotPlugin({
      tsConfigPath: './tsconfig.json',
      entryModule: './app/app.module#AppModule'
    }),
    new webpack.DllReferencePlugin({
      context: './',
      manifest: require(path.resolve(cwd, 'vendor/vendor-manifest.json'))
    }),
    new webpack.NamedModulesPlugin(),
    new ProgressBarPlugin({
      format: chalk.magenta.bold('build') + ' [' + chalk.green(':bar')+ '] ' + chalk.green.bold(':percent') + ' ' + chalk.yellow.bold(':elapsed seconds') + ' ' + chalk.white(':msg'),
      clear: false
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['node_modules', cwd]
  }
};
