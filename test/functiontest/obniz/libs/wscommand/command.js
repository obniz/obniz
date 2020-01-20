let chai = require('chai');
let expect = chai.expect;

let testUtil = require('../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('command', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done, { binary: true });
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('debug error format', function() {
    let expectJson = [{ debug: { error: { message: 'some error' } } }];
    let isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });

  it('debug error format2', function() {
    let expectJson = [
      {
        debug: { error: { message: 'some error', properties: { aaa: 'bbb' } } },
      },
    ];

    let isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });
  it('warning error format', function() {
    let expectJson = [{ debug: { warning: { message: 'some warning' } } }];
    let isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });

  it('warning error format2', function() {
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
