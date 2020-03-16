/* eslint-disable no-undef */
const request = require('supertest');
const chai = require('chai');
const server = require('../index');

const { expect } = chai;

describe('controller.js', () => {
  describe('[POST /publish', () => {
    it('should add a default subscriber if no subscriber exist', async () => {
      const res = await request(server)
        .post('/api/v1/subscriptions/publish').send({
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
    it('should publish if there are subscribed user', async () => {
      await request(server)
        .get('/api/v1/subscriptions/subscribe');
      const response = await request(server)
        .post('/api/v1/subscriptions/publish').send({
          initialDate: 'November 10 2018',
          delay: '3',
          country: 'United States',
        });
      expect(response.status).to.equal(200);
    });
  });
  describe('[GET /subscribe', () => {
    it('should return the channel subscribed to', async () => {
      const res = await request(server)
        .get('/api/v1/subscriptions/subscribe');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.keys('channel', 'topic', 'cacheKeys', 'pipeline');
      expect(res.body.channel).to.equal('BankWire');
      expect(res.body.topic).to.equal('businessDates');
    });
  });
  describe('[GET /unsubscribe', () => {
    it('should unsubscribe user', async () => {
      const res = await request(server)
        .get('/api/v1/subscriptions/unsubscribe');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.keys('ok', 'message');
      expect(res.body.ok).to.equal(true);
      expect(res.body.message).to.be.a('string');
    });
  });
});
