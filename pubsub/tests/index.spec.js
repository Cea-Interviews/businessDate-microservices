/* eslint-disable no-undef */
const chai = require('chai');
const server = require('../index');

const { expect } = chai;
describe('pub sub server.js', () => {
  it('should return server listening', async () => {
    const res = await server.listen(5565);
    expect(res.listening).to.equal(true);
  });
});
