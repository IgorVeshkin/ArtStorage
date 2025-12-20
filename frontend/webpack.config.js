const path = require("path");
const webpack = require("webpack");
require('dotenv').config()

// Установка HtmlWebpackPlugin: npm install --save-dev html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Плагин для очистки предыдущих билдов фронта: npm install --save-dev clean-webpack-plugin
// {} - скобки обязательны
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name]_[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },

      // Для обработки css-файлов в webpack, необходимо подключить style-loader и css-loader
      // Необходимо скачать эти компоненты:
      // Установка всех элементов: npm i --save-dev autoprefixer css-loader postcss-loader sass sass-loader style-loader
      // Установка только необходимых компонентов на данный момент: npm i --save-dev css-loader style-loader

       {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
       },

       // loader для обработки jsx-файлов
        {
            test: /\.jsx?$/,
            loader: "babel-loader",
            exclude: [/node_modules/, /public/],
        },

    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
        new HtmlWebpackPlugin({
            // было изначально: static/frontend/template.html
            template: 'templates/frontend/template.html',
            filename: '../../templates/frontend/index.html',
            // Добавляю иконку для tab-ов
            // favicon: './src/favicon-32x32.png',
            clean: true
        }),

      // Если возникнет ошибка при компиляции:
      // [webpack-cli] Failed to load 'D:\Documents\Python_files\Metrolog\Frontend\webpack.config.js'
      // config [webpack-cli] Error: Cannot find module 'clean-webpack-plugin'

      // Выполнить следующую команду: npm i clean-webpack-plugin
      new CleanWebpackPlugin(),


    new webpack.DefinePlugin({
      "process.env": {
        "REACT_APP_MUI_LICENSE_KEY": JSON.stringify(process.env.REACT_APP_MUI_LICENSE_KEY),
      },
    }),

  ],
};