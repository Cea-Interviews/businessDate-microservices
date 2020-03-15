/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
const businessChecker = require('business-days-calculator');
const calendar = require('holidays-calendar');
const Holidays = require('date-holidays');
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
const calculate = () => {

}
module.exports = { generateCalendar, calculate };
