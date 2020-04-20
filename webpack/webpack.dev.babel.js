import Path from 'path';
import Webpack from 'webpack';
import merge from 'webpack-merge';
import base from './webpack.base.js';


export default merge(base, {
  mode: "development",
  devtool: "cheap-eval-source-map",
  output: {
    chunkFilename: "js/[name].chunk.js"
  },
  stats: {
    colors: true
  },
  devServer: {
    inline: true
  },
  plugins: [
    new Webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
      'process.env.AFFILIATE_API': JSON.stringify(process.env.AFFILIATE_API),
      'process.env.CANONICAL_PARTNER': JSON.stringify(process.env.CANONICAL_PARTNER)
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, "../src"),
        enforce: "pre",
        loader: "eslint-loader",
        options: {
          emitWarning: true
        }
      },
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, "../src"),
        loader: "babel-loader"
      },
      {
        test: /\.s[ac]ss$/i,
        include: Path.resolve(__dirname, "../src"),
        use: [
          "style-loader",
          "css-loader?sourceMap=true",
          {
            loader: 'postcss-loader', options: {
              plugins: [
                require('autoprefixer')
              ]
            }
          },
          "sass-loader"
        ]
      },
      // {
      //   test: /\.html$/,
      //   include: Path.resolve(__dirname, "../src"),
      //   use: [
      //     {
      //       loader: "html-loader",
      //       options: {
      //         minimize: true,
      //         removeComments: false,
      //         collapseWhitespace: false
      //       }
      //     }
      //   ]
      // }
    ]
  }
});
