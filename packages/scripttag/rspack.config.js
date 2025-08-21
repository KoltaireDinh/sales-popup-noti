const path = require('path');
const dotenv = require('dotenv');
const {rspack} = require('@rspack/core');

// Load environment variables based on NODE_ENV
const getEnvPath = () => {
  const environment = process.env.ENVIRONMENT;
  const envMap = {
    production: '.env.production',
    staging: '.env.staging',
    development: '.env.development',
    test: '.env.test'
  };

  // Try environment specific file first, fallback to .env
  const envFile = environment ? envMap[environment] : '.env';
  return path.resolve(__dirname, envFile);
};

// Load .env file
const envPath = getEnvPath();
const result = dotenv.config({path: envPath});

if (result.error) {
  console.warn(`⚠️  No ${envPath} file found. Using existing environment variables.`);
}

// Required environment variables
const requiredEnvVars = ['NODE_ENV'];

// Validate required env vars
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} environment variable is required but not defined.`);
  }
});

const isProduction = process.env.NODE_ENV === 'production';
const PUBLIC_PATH = process.env.PUBLIC_PATH || 'http://localhost:5000/scripttag/';
const jsPath = process.env.HOST ? `${process.env.HOST}/scripttag/` : PUBLIC_PATH;

/** @type {import('@rspack/cli').Configuration} */
module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: ['./src/index.js'],
  devtool: isProduction ? false : 'eval-source-map',
  experiments: {asyncWebAssembly: true, topLevelAwait: true},
  output: {
    path: path.resolve(__dirname, '../../static/scripttag'),
    filename: 'avada-sale-pop.min.js',
    publicPath: jsPath,
    chunkFilename: '[name].[contenthash].bundle.js',
    assetModuleFilename: '[name].[hash][ext]',
    crossOriginLoading: 'anonymous',
    scriptType: 'text/javascript'
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
        test: /\.jsx?$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'ecmascript',
                jsx: true
              }
            }
          }
        },
        type: 'javascript/auto'
      },
      {
        test: /\.(sass|scss|css)$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: isProduction ? '[hash:base64:8]' : '[path][name]__[local]',
                exportLocalsConvention: 'camelCase'
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass-embedded'),
              sassOptions: {
                includePaths: [
                  path.resolve(__dirname, '../../assets/src/styles'),
                  path.resolve(__dirname, 'node_modules')
                ]
              }
            }
          }
        ],
        type: 'javascript/auto'
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: '[name].[hash][ext]'
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name].[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new rspack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      ENVIRONMENT: process.env.ENVIRONMENT,
      HOST: process.env.HOST || '',
      PUBLIC_PATH: PUBLIC_PATH,
      API_URL: process.env.API_URL || '',
      APP_URL: process.env.APP_URL || '',
      SHOPIFY_CDN_URL: process.env.SHOPIFY_CDN_URL || PUBLIC_PATH
    }),
    new rspack.IgnorePlugin({
      checkResource: resource => resource.startsWith('https://cdnapps.avada.io/')
    })
  ],
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'named',
    minimize: isProduction,
    mangleExports: false,
    runtimeChunk: false,
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minChunks: 2,
      automaticNameDelimiter: '.',
      cacheGroups: {
        preact: {
          test: /[\\/]node_modules[\\/]preact[\\/]/,
          name: 'vendor.preact',
          chunks: 'async',
          priority: 30,
          reuseExistingChunk: true,
          enforce: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor.common',
          chunks: 'async',
          priority: 20,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    }
  }
};
