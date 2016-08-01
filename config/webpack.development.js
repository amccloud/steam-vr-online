/* eslint-env node */

import webpack from 'webpack';
import defaultConfig from './webpack.default';

const port = process.env.PORT || 8080;

const common = {
  debug: true,
  devtool: 'eval'
};

export default {
  ...defaultConfig,
  client: {
    ...defaultConfig.client,
    ...common,
    entry: [
      'webpack-dev-server/client?http://0.0.0.0:' + port,
      'webpack/hot/dev-server',
      ...defaultConfig.client.entry
    ],
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development')
        }
      })
    ]
  },
  updateMetrics: {
    ...defaultConfig.updateMetrics,
    ...common,
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
          STEAM_API_KEY: JSON.stringify(process.env.STEAM_API_KEY),
          RETHINKDB_HOST: JSON.stringify(process.env.RETHINKDB_HOST),
          RETHINKDB_PASSWORD: JSON.stringify(process.env.RETHINKDB_PASSWORD)
        }
      })
    ]
  }
};
