
const server = require('../index')
const chai = require("chai")
const expect = chai.expect

describe('api server.js', () => {
      it("should return server listening", async()=> {
           const res = await server.listen(55588)
           expect(res.listening).to.equal(true)
      })
})