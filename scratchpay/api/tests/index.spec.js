
const server = require('../index')
const chai = require("chai")
const expect =chai.expect

describe('api server.js', () => {
      it("should return server listening", async()=> {
           const res = await server.listen(5556)
           expect(res.listening).to.equal(true)
      })
})