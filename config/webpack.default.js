/* eslint-env node */

import {resolve} from 'path';

const common = {
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loader: 'json'
    }]
  },
  resolve: {
    root: [
      resolve(__dirname, '..', 'src')
    ]
  }
};

export default {
  client: {
    ...common,
    entry: [
      'babel-polyfill',
      'client'
    ],
    output: {
      path: resolve(__dirname, '../build'),
      filename: 'client.js'
    },
    devServer: {
      contentBase: 'build',
      noInfo: true,
      inline: true,
      hot: true
    }
  },
  updateMetrics: {
    ...common,
    target: 'node',
    entry: [
      'regenerator-runtime/runtime',
      'task/updateMetrics'
    ],
    output: {
      path: resolve(__dirname, '../build/task'),
      filename: 'updateMetrics.js',
      libraryTarget: 'commonjs2'
    }
  },
  proxy: {
    ...common,
    target: 'node',
    entry: [
      'regenerator-runtime/runtime',
      'task/proxy'
    ],
    output: {
      path: resolve(__dirname, '../build/task'),
      filename: 'proxy.js',
      libraryTarget: 'commonjs2'
    }
  }
};
