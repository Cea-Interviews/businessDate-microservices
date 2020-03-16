/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
const businessChecker = require('business-days-calculator');
const calendar = require('holidays-calendar');
const Holidays = require('date-holidays');
const { DateTime, Duration } = require('luxon');
const countryCodes = require('./codes');

/**
 * Represents a function to generate the calendar of a specific country and set the business checker to it
 * @function generateCalendar
 * @async
 * @param {number} years - An spread of three years to generate holiday calendars for.
 * @param {string} country - The country(locale) where the bank checked is located
 * @returns {Promise <object>} status code and data or error message
 */

const generateCalendar = (country, ...years) => {
  // initialize holiday package
  const hd = new Holidays();
  // get all countries that have a calender
  const countries = hd.getCountries();
  // if no country inputed ad argument use united states as default
  country = country || 'United States';
  // get the country code of the inputted country
  const countryUsed = countryCodes.filter(
    (singleCountry) => singleCountry.name.toLowerCase() === country.toLowerCase(),
  );
  // check if country code exists for countires in the holiday package
  const value = Object.keys(countries).includes(countryUsed[0].code);
  if (value) {
    const holidays = [];
    // if country exists , get the holidays for that country for the number of years specified
    hd.init(countryUsed[0].code);
    for (let i = 0; i < years.length; i++) {
      holidays.push(...hd.getHolidays(years[i]));
    }
    const format = {};
    // create a calendar of holidays which are either bank or public holidays specific to that country and encode it an object format.
    holidays.forEach((holiday) => {
      if (
        !holiday.substitute
        && (holiday.type === 'bank' || holiday.type === 'public')
      ) {
        const date = new Date(holiday.date);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const day = date.getDate();
        if (format[year]) {
          format[year].total++;
          if (format[year].months.month) {
            format[year].months[month].total++;
            format[year].months[month].days[day] = holiday.name;
          } else {
            format[year].months[month] = {
              total: 1,
              days: {
                [day]: holiday.name,
              },
            };
          }
        } else {
          format[year] = {
            total: 1,
            months: {
              [month]: {
                total: 1,
                days: {
                  [day]: holiday.name,
                },
              },
            },
          };
        }
      }
    });
    // create a new calendar using the format initially created
    calendar.AddCalendar(countryUsed[0].code, format);
    // set the businessChecker to calculate dates based on the that specific country calculator
    businessChecker.SetCalendar(calendar.Locale(countryUsed[0].code));
    return businessChecker;
  }
  // if the country does not exists return an error
  return {
    error: `Calender Not Created, No Available calendar for ${countryUsed[0].code}`,
  };
};

/**
 * Represents a function to calucate the next business date, number of holidays and/or weekends and the total number of days  delayed.
 * @function calculate
 * @async
 * @param {date} initialDate - The business date which serves as the starting date for counting delay
 * @param {number} delay - The number of days delayed starting from initial date
 * @param {string} country - The country(locale) where the bank checked is located
 * @returns {Promise <object>} status code and data or error message
 */
const calculate = (date, delay, country) => {
  const startDate = new Date(date);
  const initialDelay = delay;
  const year = startDate.getFullYear();
  const checker = generateCalendar(country, year, year + 1, year + 2);
  // if calendar exists
  if (!checker.error) {
    let businessDays = 0;
    let holidays = 0;
    let weekends = 0;
    // convert to utc
    const startDateInUTC = DateTime.fromISO(startDate.toISOString());
    for (let i = 0; i < delay; i++) {
      const delayedTime = Duration.fromObject({ hours: i * 24 });
      const proposedDate = new Date(
        startDateInUTC.plus(delayedTime).toString(),
      );
      // check if it a business date
      if (checker.IsBusinessDay(proposedDate)) {
        businessDays++;
      } else {
        // otherwise increment the delay because it would either be a holiday or weekend
        delay++;
        // check if it is a weekend
        if (proposedDate.getDay() === 6 || proposedDate.getDay() === 0) {
          weekends++;
        }
        /* check if it is  holiday. 
        if its a holiday that falls in a weekend, it wuld be automatically increse the delays moving the holiday to a week day */
        if (checker.IsHoliday(proposedDate)) {
          holidays++;
        }
      }
    }
    const totalDays = weekends + holidays + businessDays;
    const finalDelays = delay > 0
      ? Duration.fromObject({ hours: (totalDays - 1) * 24 })
      : Duration.fromObject({ hours: totalDays * 24 });
    const finalBusinessDate = new Date(
      startDateInUTC.plus(finalDelays).toString(),
    );
    const output = {
      initialQuery: {
        initialDate: startDate,
        delay: initialDelay,
      },
      results: {
        businessDate: finalBusinessDate,
        totalDays,
        holidayDays: holidays,
        weekendDays: weekends,
      },
    };
    return output;
  }
  return checker;
};
module.exports = { generateCalendar, calculate };
