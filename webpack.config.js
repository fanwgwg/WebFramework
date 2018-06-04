const path = require('path');

module.exports = {
  // entry: './src/reduxapp/index.js',
  // entry: './src/routerapp/index.js',
  // entry: './src/index.js',
  entry: './src/app/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
  devServer: {
    publicPath: '/',
    contentBase: path.resolve(__dirname),
    historyApiFallback: true,
  },
};
