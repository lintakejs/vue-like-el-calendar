
const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const uglify = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: 'source-map',

  mode:'development',
  
  entry: "./index.js",

  output: {
    path: path.resolve(__dirname, '../dist'),//输出路径，就是上步骤中新建的dist目录，
    publicPath: '/dist/',
    filename: 'vue-like-el-calendar.min.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.jade$/,
        loader: "jade"
      },      
      {
        test: /\.pug$/,
        use: ['pug-plain-loader']
      },
      {
        test: /\.less$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "less-loader" }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: 'babel-loader',
        query: {presets: ['es2015']}
      },
      {
        test: /\.(png|jpg|gif|ttf|svg|woff|eot)$/,
        loader: 'url-loader',
        query: {
            limit: 30000,
            name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    }),
    new VueLoaderPlugin(),
    new uglify({
      uglifyOptions: {
        //删除注释
        output:{
          comments:false
        },
        //删除console 和 debugger  删除警告
        compress:{
            warnings:false,
            drop_debugger:true,
            drop_console:true
        }
      }
    })
  ]
}