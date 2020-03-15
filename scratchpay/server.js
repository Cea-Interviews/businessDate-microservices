/* eslint-disable no-unused-vars */
const path = require('path');
const gateway = require('express-gateway');
const businessApi = require('./api/index');

gateway()
  .load(path.join(__dirname, 'config'))
  .run();
