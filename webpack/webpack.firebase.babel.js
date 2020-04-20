import Path from 'path';
import Webpack from 'webpack';
import merge from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import S3Plugin from 'webpack-s3-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

import base from './webpack.base.js';

export default merge(base, {
  mode: 'production',
  stats: 'errors-only',
  bail: true,
  output: {
    filename: 'js/gempages-[name].js',
    chunkFilename: 'js/gempages-vendor.js',
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.AFFILIATE_API': JSON.stringify(process.env.AFFILIATE_API),
      'process.env.CANONICAL_PARTNER': JSON.stringify(process.env.CANONICAL_PARTNER)
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: Path.resolve(__dirname, '../public'), to: '' }
    ]),
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/gempages-[name].css',
      chunkFilename: 'css/gempages-vendor.css'
    }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.s?css/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader', options: {
              plugins: [
                require('autoprefixer')
              ]
            }
          },
          'sass-loader'
        ]
      }
    ]
  }
});
