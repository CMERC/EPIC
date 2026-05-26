// vue.config.js
const path = require('path')
const webpack = require('webpack')
const CopywebpackPlugin = require('copy-webpack-plugin')
// The path to the cesium source code
const cesiumSource = 'node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'

module.exports = {
  publicPath: process.env.DEPLOY_PAGES ? '/epic-vue/' : '/',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: 4467,
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [{ from: /./, to: '/index.html' }]
    },
    proxy: {
      '/graphql': {
        target: process.env.VUE_APP_PROXY_TARGET || 'http://localhost:4000',
        changeOrigin: true,
        ws: true
      },
      '/link': {
        target: process.env.VUE_APP_PROXY_TARGET || 'http://localhost:4000',
        changeOrigin: true
      }
    },
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    }
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
    output: {
      // Needed to compile multiline strings in Cesium
      sourcePrefix: ''
    },
    amd: {
      // Enable webpack-friendly use of require in Cesium
      toUrlUndefined: true
    },
    resolve: {
      alias: {
        // Cesium module name
        cesium: path.resolve(__dirname, cesiumSource),
        'cesium$': path.resolve(__dirname, cesiumSource, 'Cesium.js'),
        'ol/layer/BaseVector.js': path.resolve(
          __dirname,
          'node_modules/ol/layer/Vector.js'
        )
      },
      fallback: {
        fs: false
      }
    },
    optimization: {
      minimize: false,
      splitChunks: {
        chunks: 'all'
      }
    },
    module: {
      rules: [
        {
          test: /favicon\.ico$/,
          loader: 'url-loader',
          options: {
            limit: 1,
            name: '[name].[ext]'
          }
        },
        {
          // Strip cesium pragmas
          test: /\.js$/,
          enforce: 'pre',
          include: path.resolve(__dirname, cesiumSource),
          use: [
            {
              loader: 'strip-pragma-loader',
              options: {
                pragmas: {
                  debug: false
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [
      // Copy Cesium Assets, Widgets, and Workers to a static directory
      new CopywebpackPlugin({
        patterns: [
          { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }
        ]
      }),
      new CopywebpackPlugin({
        patterns: [{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]
      }),
      new CopywebpackPlugin({
        patterns: [{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]
      }),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify('/#')
      }),
      new webpack.NormalModuleReplacementPlugin(
        /^cesium$/,
        path.resolve(__dirname, cesiumSource, 'Cesium.js')
      )
    ]
  }
}
