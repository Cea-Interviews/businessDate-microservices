/* eslint-disable consistent-return */
const path = require('path');
const { calculate, generateCalendar } = require('../../utils/calculator');
const logger = require('../../logging/logger');

const filename = path.dirname(__filename);

const businessDate = async (req, res) => {
  const { initialDate, delay, country } = req.body;
  try {
    const data = calculate(initialDate, delay, country);
    if (!data.error) {
      return res.status(200).json({
        ok: true,
        ...data,
      });
    }
    logger.error(`${filename}:checkBusinessDay 404:- `, data.error);
    return res.status(404).json({
      ok: false,
      message: data.error,
    });
  } catch (err) {
    logger.error(`${filename}:checkBusinessDay 500:- `, err);
    return res.status(500).json({
      ok: false,
      error: 'Something went wrong',
    });
  }
};

const checkBusinessDay = async (req, res) => {
  const { initialDate, country } = req.body;
  try {
    const date = new Date(initialDate);
    const year = date.getFullYear();
    const businessCalendar = year.toString() !== 'NaN'
      ? generateCalendar(country, year)
      : { error: 'Date does not exist' };
    if (!businessCalendar.error) {
      const response = businessCalendar.IsBusinessDay(date);
      return res.status(200).json({
        ok: true,
        isBusinessDay: response,
      });
    }
    if (businessCalendar.error) {
      logger.error(`${filename}:checkBusinessDay 404:- `, businessCalendar.error);
      return res.status(404).json({
        ok: false,
        message: businessCalendar.error,
      });
    }
  } catch (err) {
    logger.error(`${filename}:checkBusinessDay 500:- `, err);
    return res.status(500).json({
      ok: false,
      error: 'Something went wrong',
    });
  }
};

module.exports = { businessDate, checkBusinessDay };
