const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const line = '---------------------------------------------------------';
const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
process.stdout.write(`${line}\n${msg}\n${line}\n`);

module.exports = {
  mode: 'production',
  entry: './src/main.ts',
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: './bundle.min.js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
    },
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 2500000,
    maxAssetSize: 1200000,
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
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true),
      'typeof WEBGL_DEBUG': JSON.stringify(false),
      'typeof EXPERIMENTAL': JSON.stringify(false),
      'typeof PLUGIN_3D': JSON.stringify(false),
      'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
      'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
      'typeof FEATURE_SOUND': JSON.stringify(true),
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/assets', to: 'assets' },
        { from: 'public/favicon.png', to: 'favicon.png' },
        { from: 'public/style.css', to: 'style.css' },
      ],
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG: false,
      npm_package_version: JSON.stringify(process.env.npm_package_version),
      API_URL: 'http://localhost:3000',
    }),
  ],
};
