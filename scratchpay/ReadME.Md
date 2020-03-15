# BusinessDate MicroServices

### About
A micro-service architecture implementation of business date checks  consisting of a business date api service , a pub-sub service and centralized logging service
### Features

- Using an initial data and number of days delays check for the business date after the delay and total number of days passed based on your country(locale)
- Check if a day is a business day depending on your country
- Using the pub-sub pattern subscribe for BankWire information
- Log outputs from different services in the micro-service to a centralized log


### NPM Scripts

To get the server running locally:

- Clone this repo
- **npm install** to install all required dependencies
- **npm start** to start the local server
- **npm test** to start server using testing environment

## Technologies

[NodeJS](https://nodejs.org/en/) || [**Express.js**](https://expressjs.com/) || [**Express-Gateway**](https://www.express-gateway.io/) || [**Postal.j**](https://github.com/postaljs) || [**Luxon**](https://moment.github.io/luxon/) ||[**Business-Day-Calculator**]() || [**Business-Day-Calculator**](https://www.npmjs.com/package/business-days-calculator) ||[**Date-Holidays**](https://www.npmjs.com/package/date-holidays) || [**Holidays-Calendar**](https://www.npmjs.com/package/holidays-calendar) || [**Winston**](https://github.com/winstonjs/winston)

## Supporting Packages

Linter

- [ESLint](https://eslint.org/)

Test Tools

- [Mocha](https://jestjs.io/)
- [Chai](https://www.chaijs.com/)
- [Supertest](https://github.com/visionmedia/supertest)
