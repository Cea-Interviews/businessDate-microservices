/* eslint-disable no-undef */
const chai = require('chai');

const { expect } = chai;
const { generateCalendar, calculate } = require('../calculator');

describe('use utilities', () => {
  describe('generateCalendar', () => {
    it('should fail if calendar does not exist', async () => {
      const res = await generateCalendar('Nigeria', 2018);
      expect(res)
        .to.be.an('object')
        .with.key('error');
    });
    it('should default to us if no locale is given', async () => {
      const res = await generateCalendar('', 2018);
      expect(res.Locale()).to.equal('US');
    });
    it('should set calendar to given locale if it exists', async () => {
      const res = await generateCalendar('Andorra', 2018, 2019, 2020);
      expect(res.Locale()).to.equal('AD');
    });
  });
  describe('calculate', () => {
      it("should return erro if calendar deos not exist" , async() => {
        const res = await calculate("November 10 2018",1 , "Nigeria")
        expect(res).to.be.an('object').with.key('error')
      });
      it("should check if a day is a weekend", async()=> {
        const res = await calculate('November 24 2018', 1, 'United States')
        expect(res.results.weekendDays).to.equal(2)
        expect(res.results.holidayDays).to.equal(0)

      });
      it("should check if a day is a business day", async()=> {
        const res = await calculate('November 26 2018', 0, 'United States')
        expect(res.results.businessDate.toISOString()).to.equal(new Date("November 26 2018").toISOString())
        expect(res.results.weekendDays).to.equal(0)
        expect(res.results.holidayDays).to.equal(0)

      });
      it("should check if a day is a holiday", async()=> {
        const res = await calculate('November 22 2018', 1, 'United States')
        expect(res.results.weekendDays).to.equal(0)
        expect(res.results.holidayDays).to.equal(1)

      })
  })
});
