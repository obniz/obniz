let chai = require('chai');
let expect = chai.expect;

let testUtil = require('../../../testUtil.js');



describe('command', function () {
  beforeEach(async function () {
    await testUtil.setupObnizPromise(this, null, { binary: true });
  });

   afterEach(async function () {
    await testUtil.releaseObnizePromise(this);
  });

  it('debug error format', function () {
    let expectJson = [{ debug: { error: { message: 'some error' } } }];
    let isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });

  it('debug error format2', function () {
    let expectJson = [
      {
        debug: { error: { message: 'some error', properties: { aaa: 'bbb' } } },
      },
    ];

    let isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });
  it('warning error format', function () {
    let expectJson = [{ debug: { warning: { message: 'some warning' } } }];
    let isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });

  it('warning error format2', function () {
    let expectJson = [
      {
        debug: {
          warning: { message: 'some warning', properties: { aaa: 'bbb' } },
        },
      },
    ];

    let isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });
});
