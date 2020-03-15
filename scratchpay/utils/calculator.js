/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
const businessChecker = require('business-days-calculator');
const calendar = require('holidays-calendar');
const Holidays = require('date-holidays');
const { DateTime, Duration } = require('luxon');
const countryCodes = require('./codes');

const generateCalendar = (country, ...years) => {
  const hd = new Holidays();
  const countries = hd.getCountries();
  country = country || 'United States';
  const countryUsed = countryCodes.filter(
    (singleCountry) => singleCountry.name.toLowerCase() === country.toLowerCase(),
  );
  const value = Object.keys(countries).includes(countryUsed[0].code);
  if (value) {
    const holidays = [];
    hd.init(countryUsed[0].code);
    for (let i = 0; i < years.length; i++) {
      holidays.push(...hd.getHolidays(years[i]));
    }
    const format = {};
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
    calendar.AddCalendar(countryUsed[0].code, format);
  } else {
    return {
      error: `Calender Not Created, No Available calendar for ${countryUsed[0].code}`,
    };
  }
  businessChecker.SetCalendar(calendar.Locale(countryUsed[0].code));
  return businessChecker;
};
const calculate = (date, delay, country) => {
  const startDate = new Date(date);
  const initialDelay = delay;
  const year = startDate.getFullYear();
  const checker = generateCalendar(country, year, year + 1, year + 2);
  if (!checker.error) {
    let businessDays = 0;
    let holidays = 0;
    let weekends = 0;
    const startDateInUTC = DateTime.fromISO(startDate.toISOString());
    for (let i = 0; i < delay; i++) {
      const delayedTime = Duration.fromObject({ hours: i * 24 });
      const proposedDate = new Date(
        startDateInUTC.plus(delayedTime).toString(),
      );
      if (checker.IsBusinessDay(proposedDate)) {
        businessDays++;
      } else {
        delay++;
        if (proposedDate.getDay() === 6 || proposedDate.getDay() === 0) {
          weekends++;
        }
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
    ).toUTCString();
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
