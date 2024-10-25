const path = require("path");
// webpack.config.js
module.exports = {
  mode: "development",
  entry: ["@babel/polyfill", "./src/indexBundle.js"],
  output: {
    path: path.join(__dirname, '../src'),
    filename: "./index.js",
    publicPath: '/'
  },

  // Enable live reload
  devServer: {
    contentBase: path.join(__dirname, "../src/"),
    port: 3001,
    host: '0.0.0.0',
    useLocalIp: true,
    disableHostCheck: true,
    stats: 'minimal'
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: [".mjs", ".js", ".jsx"],
  },

  // Map compiled code to source
  // devtool: 'source-maps',
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
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
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "sass-loader",
          "postcss-loader",
          "style-loader"
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024000
            }
          }
        ]
      },
      {
        test: /\.(woff2|woff|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          }
        ]
      },
      {
        // Web worker dependencies
        test: /\.worker\.js$/,
        use: [
          {
            loader: "worker-loader",
            options: {
              inline: true,
              name: "customColumnCalculator.js"
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