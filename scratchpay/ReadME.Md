# BusinessDate MicroServices

[![Coverage Status](https://coveralls.io/repos/github/basilcea/businessDate-microservices/badge.svg)](https://coveralls.io/github/basilcea/businessDate-microservices)

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

## Actions

###  Get Business Day with delay [GET]

**URL**: _http://localhost:8080/api/v1/businessDates/getBusinessDateWithDelay_

**Returns**: An object containing the business date credentials.

Input

```javascript
{
	"initialDate" : "November 10 2018",
	"delay" : "3",
	"country": "United States"
}
```

```javascript
{
  "ok": true,
  "initialQuery": {
    "initialDate": "2018-11-09T23:00:00.000Z",
    "delay": "3"
  },
  "results": {
    "businessDate": "2018-11-13T23:00:00.000Z",
    "totalDays": 5,
    "holidayDays": 0,
    "weekendDays": 2
  }
}
```

### Check if date is business day [GET]

**URL**: _https://localhost:8080/api/v1/businessDates/isBusinessDay_

**Returns**: An object containing the business date information.

Input

```javascript
{
"initialDate" : "November 10 2018",
"country": "United States"
}
```

Returns

```javascript

    {
  "ok": true,
  "isBusinessDay": false
}
```

### Subscribe to bankwire channel[GET]

**URL**: _https://localhost:8080/api/v1/subscriptions/subscribe_

**Returns**: An an object which holds the subscription details.

Returns

```javascript
  {
  "channel": "BankWire",
  "topic": "businessDates",
  "pipeline": [],
  "cacheKeys": []
}
```


### Publish to the topic businessDates in  bankwire channel[POST]

**URL**: _https://localhost:8080/api/v1/subscriptions/publish_

**Returns**: An an object which holds the details published.
Input

```javascript
{
	"initialDate" : "November 10 2018",
	"delay" : "3",
	"country": "United States"
}
```

Returns

```javascript
{
    "ok": true,
  "initialQuery": {
    "initialDate": "2018-11-09T23:00:00.000Z",
    "delay": "3"
  },
  "results": {
    "businessDate": "2018-11-13T23:00:00.000Z",
    "totalDays": 5,
    "holidayDays": 0,
    "weekendDays": 2
  }

}
```

### Unsubscribe from a channel[GET]

**URL**: _https://localhost:8080/api/v1/subscriptions/unsubscribe_

**Returns**: An an object which an shows your subscription status.

Returns

```javascript
{
  "ok": true,
  "message": "You have succesfully unsubscribed"
}
```


