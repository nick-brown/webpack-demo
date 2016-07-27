const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./config/parts');
const pkg = require('./package.json');

const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
    path.join(__dirname, 'app', 'main.scss'),
    path.join(__dirname, 'node_modules', 'bootstrap-sass'),
  ],
  build: path.join(__dirname, 'build'),
};

const common = {
  // Entry accepts a path or an object of entries.
  // We'll be using the latter form given it's
  // convenient with more complex configurations.
  entry: {
    app: PATHS.app,
    style: PATHS.style,
    // vendor: Object.keys(pkg.dependencies), // use extractBundle config for this
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
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
    parts.clean(PATHS.build),
    {
      devtool: 'source-map',
      output: {
        path: PATHS.build,
        filename: '[name].[chunkhash].js',
        // This is used for require.ensure.  The setup will work without but this is still
        // useful to set
        chunkFilename: '[chunkhash].js',
      }
    },
    parts.babelTransform(PATHS.app),
    parts.extractCSS(PATHS.style),
    parts.purifyCSS([PATHS.app]),
    parts.minify(),
    parts.setFreeVariable('process.env.NODE_ENV', 'production'),
    parts.extractBundle({ name: 'vendor', entries: Object.keys(pkg.dependencies) })
  );
} else if(process.env.npm_lifecycle_event === 'stats') {
  config = merge(
    common,
    parts.clean(PATHS.build),
    {
      devtool: 'source-map',
      output: {
        path: PATHS.build,
        filename: '[name].[chunkhash].js',
        // This is used for require.ensure.  The setup will work without but this is still
        // useful to set
        chunkFilename: '[chunkhash].js',
      }
    },
    parts.extractCSS(PATHS.style),
    parts.purifyCSS([PATHS.app]),
    parts.minify(),
    parts.setFreeVariable('process.env.NODE_ENV', 'production'),
    parts.extractBundle({ name: 'vendor', entries: Object.keys(pkg.dependencies) })
  );
} else {
  const devConfig = {
    host: process.env.HOST,
    port: process.env.PORT,
  };

  config = merge(
    common,
    parts.devServer(devConfig),
    parts.babelTransform(PATHS.app),
    { devtool: 'eval-source-map'},
    parts.setupCSS(PATHS.style)
  );
}

module.exports = validate(config, {
  quiet: true,
});
