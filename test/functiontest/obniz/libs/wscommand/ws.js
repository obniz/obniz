let chai = require('chai');
let expect = chai.expect;

let testUtil = require('../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('ws', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done, { binary: true });
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('reset obniz on ws disconnection', function() {
    let requestJson = [
      {
        ws: {
          reset_obniz_on_ws_disconnection: false,
        },
      },
    ];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

    expect(compress).to.be.equal(null);
  });

  it('response test no.6', function() {
    let responseBinaryString = '04 03 0b 01 00 69 61 73 64 66 61 73 64 66';
    let expectJson = [
      { uart1: { data: [0, 105, 97, 115, 100, 102, 97, 115, 100, 102] } },
    ];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('ready formtat', function() {
    let expectJson = [{ ws: { ready: true } }];
    let isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });

  it('redirect formtat', function() {
    let expectJson = [{ ws: { redirect: 'wss://some_server.com' } }];
    let isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });
});
