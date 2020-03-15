const chai = require("chai");
const expect = chai.expect;
const { generateCalendar } = require("../calculator");

describe("use utilities", () => {
    describe("generateCalendar", () => {
      it("should fail if calendar does not exist", async() => {
       const res = await generateCalendar("Nigeria", 2018);
       expect(res).to.be.an('object').with.key('error')
      });
      it("should default to us if no locale is given", async() => {
       const res = await generateCalendar('',2018);
       expect (res.Locale()).to.equal("US")
      });
      it("should set calendar to given locale if it exists", async() => {
        const res = await generateCalendar("Andorra",2018 ,2019,2020);
        expect (res.Locale()).to.equal("AD")
      });
    });
});