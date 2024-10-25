const path = require("path");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin')
// const eslintFormatter = require('react-dev-utils/eslintFormatter');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// webpack.config.js
module.exports = (env) => {
  const viewName = env.viewName || 'tjn-kurve-dev';
  return {
    mode: "production",
    entry: ["./src/indexBundle.js"],
    output: {
      // path: path.resolve(__dirname, "tjn-kurve"),
      filename: "./index.js",
      path: path.join(__dirname, viewName),
      // filename: "js/[name].[fullhash:8].js",
      // chunkFilename: "js/[name].[hash:8].js",
      // publicPath: `../../../../../../p/components/tri_view_components/${viewName}/`
    },
    // devtool: 'eval-source-map',
    resolve: {
      extensions: ['.mjs', ".js", ".jsx"]
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['**/*', '!fonts', '!fonts/**', '!fonts/**/*', '!*.LICENSE', '!kurve.png', '!NOTICE.txt'],
      }),
      // Webpack 5 has the plugin inside ids
      // https://webpack.js.org/plugins/hashed-module-ids-plugin/
      new webpack.ids.HashedModuleIdsPlugin({
        context: __dirname,
        hashFunction: 'sha256',
        hashDigest: 'hex',
        hashDigestLength: 20,
      }),
      // new MiniCssExtractPlugin({
      //   filename: '[name].[contenthash:8].css',
      //   chunkFilename: '[name]-[id].[contenthash:8].css',
      // }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `./src/base.ejs`),
        // inject: false,
        filename: `${viewName}.html`
      }),
      viewName === 'tjn-kurve' && new BundleAnalyzerPlugin()
    ].filter(Boolean),
    // Map compiled code to source
    // devtool: 'source-maps',
    optimization: {
      // moduleIds: 'hashed',
      // runtimeChunk: 'single',
      // splitChunks: {
      //     chunks: 'all',
      // },
      usedExports: true,
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
    module: {
      rules: [
        // Disable Webpack's default handling of requires for .mjs files
        // https://webpack.js.org/configuration/module/#resolvefullyspecified
        {
          test: /\.m?js$/,
          include: /node_modules/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
                // presets: ["@babel/preset-env", "@babel/preset-react"]
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            "style-loader",
            "css-loader",
            "postcss-loader",
            "resolve-url-loader",
            {
              loader: "sass-loader",
              options: {
                // Prefer `dart-sass`
                implementation: require("sass"),
                sourceMap: true
              },
            }
          ]
        },
        {
          test: /\.css$/,
          // include: [path.join(__dirname, '../..'), /(node_modules)/],
          use: [
            // MiniCssExtractPlugin.loader,
            "style-loader",
            "css-loader",
            "postcss-loader",
          ]
        },
        // Webpack 5 recommends using assets instead of url/file/raw-loaders as they will be deprecated
        // https://webpack.js.org/guides/asset-modules/
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/inline',
        },
        {
          test: /\.(woff2|woff|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
        },
        {
          // Web worker dependencies
          test: /\.worker\.js$/,
          use: [
            {
              loader: "worker-loader",
              options: {
                inline: 'fallback',
                filename: "customColumnCalculator.js"
              }
            },
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
                presets: ["@babel/preset-env"]
              }
            }
          ]
        }
      ]
    },
  }
};

// Resources: https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md
// https://webpack.js.org/plugins/hashed-module-ids-plugin/
// https://webpack.js.org/migrate/5/#clean-up-configuration
