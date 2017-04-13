const path = require('path');

module.exports = {
  entry: './src/index.tsx',

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  }
}
