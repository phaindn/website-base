import Path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import _ from "lodash";
import { isArray } from "util";

//=== START env config ===
let envFile = ".env";
let envConfig = _.filter(process.argv, val => /^--env/.test(val))[0];

if (envConfig) {
  envConfig = envConfig.split("=");
  envConfig = envConfig[envConfig.length - 1];

  if (envConfig && envConfig != "") {
    envFile = `.env.${envConfig}`;
  }
}

require("dotenv").config({ path: Path.resolve(__dirname, `../${envFile}`) });
//=== END env config ===

export default new (class Config {
  constructor() {
    const config = {
      entry: {
        main: Path.resolve(__dirname, "../src/main.js"),
        partner: Path.resolve(__dirname, "../src/pages/partner/index.js"),
        register: Path.resolve(__dirname, "../src/pages/register/index.js"),
        registerForm: Path.resolve(
          __dirname,
          "../src/pages/registerForm/index.js"
        )
      },
      output: {
        path: Path.join(__dirname, "../dist"),
        filename: "js/[name].js"
      },
      optimization: {
        // splitChunks: {
        //   chunks: 'off',
        //   name: false
        // }
      },
      plugins: [
        new HtmlWebpackPlugin({
          filename: "index.html",
          template: Path.resolve(__dirname, "../src/pages/home/index.pug"),
          chunks: ["main"],
          inject: true
        }),
        new HtmlWebpackPlugin({
          filename: "partners.html",
          template: Path.resolve(__dirname, "../src/pages/partner/partner.pug"),
          chunks: ["main", "partner"],
          inject: true
        }),
        new HtmlWebpackPlugin({
          filename: "register.html",
          template: Path.resolve(
            __dirname,
            "../src/pages/register/register.pug"
          ),
          chunks: ["main", "register"],
          inject: true
        }),
        new HtmlWebpackPlugin({
          filename: "register-form.html",
          template: Path.resolve(
            __dirname,
            "../src/pages/registerForm/registerForm.pug"
          ),
          chunks: ["main", "registerForm"],
          inject: true
        })
        // new HtmlWebpackPlugin({
        //   filename: 'features.html',
        //   template: Path.resolve(__dirname, '../src/pages/features/features.pug'),
        //   chunks: ['main'],
        //   inject: true
        // }),
        // new HtmlWebpackPlugin({
        //   filename: "pricing.html",
        //   template: Path.resolve(__dirname, '../src/pages/pricing.html'),
        //   chunks: ['main']
        // })
      ],
      resolve: {
        alias: {
          "~": Path.resolve(__dirname, "../src")
        }
      },
      module: {
        rules: [
          {
            test: /\.pug$/,
            use: [
              "html-loader?attrs[]=:srcset&attrs[]=:src",
              "pug-html-loader",
            ]
          },
          {
            test: /.*\.(ico|jpg|jpeg|png|gif|webp|svg)$/,
            use: [
              {
                loader: "file-loader",
                options: {
                  name: "img/[name].[ext]",
                  publicPath: "/"
                }
              }
            ]
          },
          {
            test: /\.(eot|otf|ttf|woff|woff2)$/,
            use: {
              loader: "file-loader",
              options: {
                name: "fonts/[name].[ext]"
              }
            }
          }
        ]
      }
    };

    return config;
  }
})();
