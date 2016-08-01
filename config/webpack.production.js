/* eslint-env node */

import webpack from 'webpack';
import defaultConfig from './webpack.default';

const common = {
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      output: {comments: false}
    })
  ]
};

export default {
  ...defaultConfig,
  client: {
    ...defaultConfig.client,
    ...common,
    plugins: [
      ...common.plugins,
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          SENTRY_DSN: JSON.stringify('https://ae02a45d57344b24a57f90584b2ec96a@app.getsentry.com/88060')
        }
      })
    ]
  },
  proxy: {
    ...defaultConfig.proxy,
    ...common
  },
  updateMetrics: {
    ...defaultConfig.updateMetrics,
    ...common,
    externals: {
      rethinkdb: true
    },
    plugins: [
      ...common.plugins,
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          SENTRY_DSN: JSON.stringify('https://ae02a45d57344b24a57f90584b2ec96a:dffdf13c5e4d4f80b61675b81577b485@app.getsentry.com/88060'),
          STEAM_API_KEY: JSON.stringify(process.env.STEAM_API_KEY),
          RETHINKDB_HOST: JSON.stringify(process.env.RETHINKDB_HOST),
          RETHINKDB_PASSWORD: JSON.stringify(process.env.RETHINKDB_PASSWORD)
        }
      })
    ]
  }
};
