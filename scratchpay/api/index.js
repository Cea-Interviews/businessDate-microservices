const express = require('express');
const morgan = require('morgan');
const router = require('./router');
const logger = require('../logging/logger');

const apiServer = express();
// allow express to use json format
apiServer.use(express.json());
// use morgan combined format and write to the winston stream
apiServer.use(morgan('combined', { stream: logger.stream }));
apiServer.use('/api/v1/businessDates', router);
apiServer.listen(8000, () => {
  logger.warn('Business date api service running on port 8000 ...');
});

module.exports = apiServer;
