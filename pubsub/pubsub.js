/* eslint-disable no-return-assign */
const postal = require('postal');
const path = require('path');
const { calculate } = require('../utils/calculator');
const logger = require('../logging/logger');

const filename = path.dirname(__filename);
// eslint-disable-next-line consistent-return
const publishing = async (req, res) => {
  const { initialDate, delay, country } = req.body;
  const info = await calculate(initialDate, delay, country);
  try {
    const subscribers = postal.getSubscribersFor({
      channel: 'BankWire',
      topic: 'businessDates',
    });
    if (subscribers.length === 0) {
      postal.subscribe({
        channel: 'BankWire',
        topic: 'businessDates',
        callback: (data) => res.status(200).json({ ok: true , ...data}),
      });
    }
    postal.publish({
      channel: 'BankWire',
      topic: 'businessDates',
      data: info,
    });
  } catch (err) {
    logger.error(`${filename}:publishing 500:- `, err);
    return res.status(500).json({
      ok: false,
      message: 'Something went wrong',
    });
  }
};

const subscribing = async (req, res) => {
  const info = postal.subscribe({
    channel: 'BankWire',
    topic: 'businessDates',
    callback: (data) => data,
  });
  return res.status(200).json(info);
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
