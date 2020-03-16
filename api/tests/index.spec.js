/* eslint-disable no-undef */
const chai = require('chai');
const server = require('../index');

const { expect } = chai;

describe('api server.js', () => {
  it('should return server listening', async () => {
    const res = await server.listen(55588);
    expect(res.listening).to.equal(true);
  });
});
