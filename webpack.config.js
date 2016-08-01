/* eslint-env node */

var environment = process.env.NODE_ENV || 'development';

require('babel-register');

var configs = require('./config/webpack.' + environment).default;

module.exports = Object.keys(configs).reverse().map(function(name) {
  return configs[name];
});
