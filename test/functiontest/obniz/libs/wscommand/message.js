let chai = require('chai');
let expect = chai.expect;

let testUtil = require('../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('message.log', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done, { binary: true });
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('message', function() {
    let requestJson = [{ message: { to: ['1111-1111'], data: 'pressed' } }];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );
    expect(compress).to.be.null; // use server command
  });

  it('receive formtat', function() {
    let expectJson = [{ message: { from: '1111-1111', data: 'pressed' } }];
    let isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });

  it('receive formtat null', function() {
    let expectJson = [{ message: { from: null, data: 'pressed' } }];
    let isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });
});
