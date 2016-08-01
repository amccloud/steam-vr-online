#! /usr/bin/env babel-node

import express from 'express';
import cors from 'cors';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from '../webpack.config'; // eslint-disable-line import/default
import horizon from '@horizon/server';
import start_rdb_server from 'horizon/src/utils/start_rdb_server';

if (!module.parent) {
  start();
}

export async function start() {
  const port = 8080;
  const host = 'localhost';

  webpackConfig
    .filter(({devServer}) => devServer)
    .map((config, index) => {
      const compiler = webpack(config);
      const server = new WebpackDevServer(compiler, config.devServer);
      const nextPort = parseInt(port, 10) + index;

      return new Promise((resolve, reject) => {
        server.listen(nextPort, host, (error) => {
          if (error) { return reject(error); }
          log(`http://${host}:${nextPort}/`);
          log(`content is served from ${config.devServer.contentBase}`);
          resolve(server);
        });
      });
  });

  const {driverPort, httpPort} = await start_rdb_server();

  /* eslint-disable no-console */
  console.log('RethinkDB');
  console.log(`   ├── Admin interface: http://localhost:${httpPort}`);
  console.log(`   └── Drivers can connect to port ${driverPort}`);
  /* eslint-enable */

  const horizonServer = horizon(express().use(cors({origin: true, credentials: true})).listen(8181), {
    rdb_port: driverPort,
    permissions: false,
    auto_create_collection: true,
    auto_create_index: true,
    auth: {
      allow_anonymous: true,
      allow_unauthenticated: true,
      token_secret: 'development'
    }
  });

  horizonServer.add_request_handler('myendpoint', (raw_request, context, ruleset, metadata, send, done) => {
    done('hello');
  });
}

function log(message) {
  console.log(`[server] ${message}`); // eslint-disable-line no-console
}

