const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './src/main.ts',
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: 'bundle.min.js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@components': path.resolve(__dirname, '..', 'src', 'components'),
      '@enum': path.resolve(__dirname, '..', 'src', 'enum'),
      '@interface': path.resolve(__dirname, '..', 'src', 'interface'),
      '@scenes': path.resolve(__dirname, '..', 'src', 'scenes'),
      '@scenes': path.resolve(__dirname, '..', 'src', 'scenes'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader',
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml|glsl)$/i,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'dist/**/*')],
    }),
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true),
      'typeof WEBGL_DEBUG': JSON.stringify(true),
      'typeof EXPERIMENTAL': JSON.stringify(true),
      'typeof PLUGIN_3D': JSON.stringify(false),
      'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
      'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
      'typeof FEATURE_SOUND': JSON.stringify(true),
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: true,
      npm_package_version: JSON.stringify(process.env.npm_package_version),
      API_URL: 'http://localhost:8080/api',
    }),
  ],
};
