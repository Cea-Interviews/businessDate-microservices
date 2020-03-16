
const express = require('express');
const pubsub = require('./pubsub');

const router = express.Router();

router.get('/subscribe', pubsub.subscribing);
router.post('/publish', pubsub.publishing);
router.get('/unsubscribe', pubsub.unsubscribing);

module.exports = router;
