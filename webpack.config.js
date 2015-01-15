module.exports = {
  entry: './index.js',
  output: {
    filename: './dist/react-gif.js',
    sourceMapFilename: './dist/react-gif.map',
    library: 'Gif',
    libraryTarget: 'umd'
  },
  externals: {
    'react': 'React',
    'react/addons': 'React'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: '6to5-loader'}
    ]
  }
};
