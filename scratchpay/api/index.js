const express = require('express');
const router = require('./router');

const apiServer = express();
apiServer.use(express.json());
apiServer.use('/api/v1/businessDates', router);
apiServer.listen(8000, () => {
  console.log('Business date api service running on port 8000');
});
module.exports = apiServer;
