const path = require('path');
const Dotenv = require('dotenv-webpack');

const isProduction = process.env.NODE_ENV === 'production';
const environmentPath = !process.env.ENVIRONMENT
  ? '.env'
  : `.env.${process.env.ENVIRONMENT}`;

/**
 * @link https://stackoverflow.com/questions/47830273/babel-plugin-preset-files-are-not-allowed-to-export-objects-only-functions
 * @link https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined
 */
module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, '../../static/scripttag'),
    filename: 'avada-sale-pop.min.js'
  },
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        options: {
          limit: 10000
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: isProduction ? false : 'eval-source-map',
  plugins: [
    new Dotenv({
      safe: false,
      defaults: '.env.example',
      systemvars: true,
      path: path.resolve(__dirname, environmentPath)
    })
  ]
};
