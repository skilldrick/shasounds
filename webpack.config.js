const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './app/App.js',
  output: {
    path: 'dist',
    filename: 'index_bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          stage: 0
        },
        include: __dirname + '/app'
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/app/index.html',
      hash: true,
      filename: 'index.html',
      inject: 'body'
    })
  ]
};
