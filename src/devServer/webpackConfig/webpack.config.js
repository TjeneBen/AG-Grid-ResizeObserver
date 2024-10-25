const path = require("path");
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// webpack.config.js
module.exports = {
  mode: "development",
  entry: ["./src/indexBundle.js"],
  output: {
    path: path.join(__dirname, '../src'),
    filename: "[name].[fullhash:8].js", // hash has been replaced with fullhash in webpack 5 https://webpack.js.org/configuration/output/#template-strings
    publicPath: "/"
  },

  // Enable live reload
  devServer: {
    port: 3000,
    // hot: true,
    // host: 'localhost',
    // inline: true,
    // open: true,
    compress: true,
    static: {
      directory: path.resolve(__dirname, '../src/'),
    },
    client: {
      logging: 'warn',
      overlay: true,
    },
    historyApiFallback: true,
    // external settings
    host: 'localhost',
    allowedHosts: 'all',
    devMiddleware: {
      publicPath: '/',
      stats: 'minimal'
    },
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: [".mjs", ".js", ".jsx"],
  },
  plugins: [
    // Webpack 5 has the plugin inside ids
    // https://webpack.js.org/plugins/hashed-module-ids-plugin/
    new webpack.ids.HashedModuleIdsPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      inject: true,
      filename: 'index.html'
    })
  ],
  // Map compiled code to source
  // devtool: 'source-maps',
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all', // 默认 async 可选值 all 和 initial
      // maxInitialRequests: Infinity, // 一个入口最大的并行请求数
      // minSize: 0, // 避免模块体积过小而被忽略
      // minChunks: 1, // 默认也是一表示最小引用次数
      // cacheGroups: {
      //     vendor: {
      //         test: /[\\/]node_modules[\\/]/, // 如果需要的依赖特别小，可以直接设置成需要打包的依赖名称
      //         name(module, chunks, chcheGroupKey) { // 可提供布尔值、字符串和函数，如果是函数，可编写自定义返回值
      //             const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1] // 获取模块名称
      //             return `npm.${packageName.replace('@', '')}` // 可选，一般情况下不需要将模块名称 @ 符号去除
      //         }
      //     }
      // }
    }
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|jsx|mjs)$/,
      //   enforce: 'pre',
      //   use: [
      //     {
      //       options: {
      //         formatter: eslintFormatter,
      //         eslintPath: require.resolve('eslint'),

      //       },
      //       loader: require.resolve('eslint-loader'),
      //     },
      //   ],
      //   include: path.resolve(__dirname, "../.."),
      // },
      {
        // Disable Webpack's default handling of requires for .mjs files
        // https://webpack.js.org/configuration/module/#resolvefullyspecified
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
              presets: ["@babel/preset-env", "@babel/preset-react"]
            }
          }
        ]
      },
      {
        test: /\.css/,
        include: [path.join(__dirname, '../..'), /(node_modules)/],
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
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
  }
};