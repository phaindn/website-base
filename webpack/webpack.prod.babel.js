import Path from 'path';
import Webpack from 'webpack';
import merge from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import S3Plugin from 'webpack-s3-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

import base from './webpack.base.js';

let S3Config = {};

if (process.env.NODE_BUILD_ENV === 'production') {
  S3Config = {
    basePath: "",
    directory: "dist",
    include: /.*\.(html|ico|css|js|svg|png|jpg|ttf|woff|eot|webp)/,
    exclude: /.*\.(build|map)/,
    s3Options: {
      accessKeyId: process.env.GEM_AWS_ACCESS_KEY || "AKIAJ6K24INH4JJ5BPIQ",
      secretAccessKey: process.env.GEM_AWS_SECRET_KEY || "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",
      region: process.env.GEM_AWS_REGION || "us-west-2"
    },
    s3UploadOptions: {
      Bucket: process.env.GEM_AWS_BUCKET || "gempagesv5-partner-test",
      ContentEncoding(fileName) {
        if (/\.(js|css|html)$/.test(fileName)) {
          return 'gzip';
        }
      },
      ContentType(fileName) {
        if (/\.css/.test(fileName)) {
          return 'text/css';
        }
        if (/\.js/.test(fileName)) {
          return 'text/javascript';
        }
      },
      CacheControl(fileName) {
        if (/\.(ico|css|js|svg|png|jpg|ttf|woff|eot|webp)/.test(fileName)) {
          return 'max-age=31536000';
        }
      }
    }
  };
}

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
    process.env.NODE_BUILD_ENV === "production"
      ? new CompressionPlugin({
        test: /\.(js|css|html)$/,
        filename: '[path]',
        algorithm: 'gzip'
      })
      : false
    ,
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/gempages-[name].css',
      chunkFilename: 'css/gempages-vendor.css'
    }),
    process.env.NODE_BUILD_ENV === "production"
      ? new S3Plugin(S3Config)
      : false
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
