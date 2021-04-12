const PATHS = {
  build: require('path').resolve(__dirname, './build'),
}

module.exports = {
  mode: "development",
  entry: './src/index.ts',
  output: {
    filename: "index.js",
    path: PATHS.build,
    publicPath: PATHS.build,
  },
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ],
  },
};

