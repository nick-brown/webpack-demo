const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./config/parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const common = {
  // Entry accepts a path or an object of entries.
  // We'll be using the latter form given it's
  // convenient with more complex configurations.
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name]-[hash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo'
    })
  ]
};

var config;

if(process.env.npm_lifecycle_event === 'build') {
  config = merge(
    common,
    { devtool: 'source-map' },
    parts.setupCSS(PATHS.app),
    parts.minify(),
    parts.setFreeVariable('process.env.NODE_ENV', 'production')
  );
} else {
  const devConfig = {
    host: process.env.HOST,
    port: process.env.PORT,
  };

  config = merge(
    common,
    parts.devServer(devConfig),
    { devtool: 'eval-source-map'},
    parts.setupCSS(PATHS.app)
  );
}

module.exports = validate(config);
