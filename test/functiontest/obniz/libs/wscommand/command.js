const chai = require('chai');
const expect = chai.expect;

const testUtil = require('../../../testUtil.js');

describe('command', function () {
  beforeEach(async function () {
    await testUtil.setupObnizPromise(this, null, { binary: true });
  });

  afterEach(async function () {
    await testUtil.releaseObnizPromise(this);
  });

  it('debug error format', function () {
    const expectJson = [{ debug: { error: { message: 'some error' } } }];
    const isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });

  it('debug error format2', function () {
    const expectJson = [
      {
        debug: { error: { message: 'some error', properties: { aaa: 'bbb' } } },
      },
    ];

    const isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });
  it('warning error format', function () {
    const expectJson = [{ debug: { warning: { message: 'some warning' } } }];
    const isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });

  it('warning error format2', function () {
    const expectJson = [
      {
        debug: {
          warning: { message: 'some warning', properties: { aaa: 'bbb' } },
        },
      },
    ];

    const isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });
});
