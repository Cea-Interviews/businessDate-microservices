const express = require('express');
const morgan = require('morgan');
const router = require('./router');
const logger = require('../logging/logger');

const pubsubServer = express();
pubsubServer.use(express.json());
pubsubServer.use(morgan('combined', { stream: logger.stream }));
pubsubServer.use('/api/v1/subscriptions', router);
const port = 4000;
pubsubServer.listen(port, () => {
  logger.warn(`pub sub service running on port ${port} ...`);
});

module.exports = pubsubServer;
