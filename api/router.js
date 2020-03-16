const express = require('express');
const controllers = require('./controller/controller');

const router = express.Router();
router.get('/getBusinessDateWithDelay', controllers.businessDate);
router.post('/getBusinessDateWithDelay', controllers.businessDate);
router.get('/isBusinessDay', controllers.checkBusinessDay);

module.exports = router;
