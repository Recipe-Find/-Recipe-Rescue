const path = require('path');
// const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './client/index.js',
  mode: process.env.NODE_ENV,
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  devServer: {
    // watchFiles: ['client/**/*'],
    // proxy: {
    //   '/recipe': 'http://localhost:3000',
    //   '/favoriteRecipe': 'http://localhost:3000',
    // },
    proxy: [
      {
        context: ['/recipe', '/favoriteRecipe'],
        target: 'http://localhost:3000'
      },
      //For login, logout, and signup, proxy all request, except for GET request
      {
        context: ['/login', '/logout', '/signup', '/'],
        target: 'http://localhost:3000',
        bypass: (req) => {
          return req.method === 'GET' ? '/index.html' : undefined;
        }
      }
    ],
    // match the output path
    static: {
      directory: path.resolve(__dirname, 'client/assets'),
      // match the output 'publicPath'
      publicPath: '/'
    },
    compress: true,
    port: 8080,
    historyApiFallback: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'client'),
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', 'jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      //Create a file name index.html in the same folder with bunder.js
      template: path.join(__dirname, './client/index.html')
    })
  ]
};
