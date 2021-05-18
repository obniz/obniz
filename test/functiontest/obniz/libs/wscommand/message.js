const chai = require('chai');
const expect = chai.expect;

const testUtil = require('../../../testUtil.js');

describe('message.log', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this, null, { binary: true });
  });

  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('message', function () {
    const requestJson = [{ message: { to: ['1111-1111'], data: 'pressed' } }];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );
    expect(compress).to.be.null; // use server command
  });

  it('receive formtat', function () {
    const expectJson = [{ message: { from: '1111-1111', data: 'pressed' } }];
    const isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });

  it('receive formtat null', function () {
    const expectJson = [{ message: { from: null, data: 'pressed' } }];
    const isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });
});
