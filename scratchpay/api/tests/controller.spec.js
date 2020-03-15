/* eslint-disable no-undef */
const request = require('supertest');
const chai = require('chai');
const controller = require('../controller/controller');
const server = require('../index');

const { expect } = chai;

describe('controller.js', () => {
  describe('[POST|GET] /getBusinessDateWithDelay', () => {
    it('should fail if the holiday calendar does not exist', async () => {
      const res = await request(server)
        .post('/api/v1/businessDates/getBusinessDayWithDelay')
        .send({
          initialDate: 'November 10 2018',
          delay: '3',
          country: 'Nigeria',
        });
      expect(res.status).to.equal(404);
      expect(res.body)
        .to.be.an('object')
        .with.keys('ok', 'message');
      expect(res.body.ok)
        .to.be.a('boolean')
        .that.equals(false);
      expect(res.body.mesage)
        .to.be.a('string')
        .that.equals('Calendar Not Created, No Availabe calendar for NG ');
    });
    it('should pass if holiday calendar exists', async () => {
      const res = await request(server)
        .post('/api/v1/businessDates/getBusinessDateWithDelay')
        .send({
          initialDate: 'November 10 2018',
          delay: '3',
          country: 'United States',
        });
      expect(res.status).to.equal(200);
      expect(res.body)
        .to.be.an('object')
        .with.keys('ok', 'initialQuery', 'results');
      expect(res.body.ok)
        .to.be.a('boolean')
        .that.equals(true);
      expect(res.body.initialQuery)
        .to.be.an('object')
        .with.keys('initialDate', 'delay');
      expect(res.body.results)
        .to.be.an('object')
        .with.keys('businessDate', 'totalDays', 'holidayDays', 'weekendDays');
    });
    it('should fail if it encounters other errors', async () => {
      sinon
        .stub(controller, 'businessDate')
        .throws(Error('something went wrong'));
      const res = await request(server)
        .post('/api/v1/businessDates/getBusinessDateWithDelay')
        .send({
          initialDate: 'Keep 10 2018',
          delay: '3',
          country: 'United States',
        });
      expect(res.status).to.equal(500);
    });
  });
});