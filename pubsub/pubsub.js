const postal = require('postal');
const path = require('path');
const { calculate } = require('../utils/calculator');
const logger = require('../logging/logger');

const filename = path.dirname(__filename);
const publishing = async (req, res) => {
  const { initialDate, delay, country } = req.body;
  const info = calculate(initialDate, delay, country);
  await postal.publish({
    channel: 'BankWire',
    topic: 'businessDates',
    data: info,
    callback: () => res.status(200).json({ info }),
  });
  logger.error(`${filename}:publishing 404:- `, 'Publishing Failed');
  return res.status(404).json('No subscriptions');
};

const subscribing = async (req, res) => {
  const data = await postal.subscribe({
    channel: 'BankWire',
    topic: 'businessDates',
  });
  return res.status(200).json(data);
};
const unsubscribing = async (req, res) => {
  postal.unsubscribe(postal.subscribe({ topic: 'businessDates' }).once());
  return res
    .status(200)
    .json({ ok: true, message: 'You have succesfully unsubscribed' });
};

module.exports = {
  publishing,
  subscribing,
  unsubscribing,
};
