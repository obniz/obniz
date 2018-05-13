let chai = require('chai');
let expect = chai.expect;
let testUtil = require('../../../testUtil.js');

chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('system.log', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done, { binary: true });
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('request test no.0', function() {
    let requestJson = [{ system: { wait: 100 } }];
    let expecteBinaryStrings = ['00 04 02 00 64'];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

    let binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function(val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request test no.1', function() {
    let requestJson = [{ system: { keep_working_at_offline: false } }];
    let expecteBinaryStrings = ['00 05 01 01'];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

    let binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function(val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request test no.2', function() {
    let requestJson = [{ system: { reset: true } }];
    let expecteBinaryStrings = ['00 02 00'];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

    let binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function(val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('debug warning', function() {
    let responseBinaryString = '0 9 3 0 1 dc';
    let expectJson = [
      {
        debug: {
          warning: {
            message: 'Low Voltage 4.76v. connect obniz to more powerful USB.',
          },
        },
      },
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

  it('request reboot', function() {
    let requestJson = [{ system: { reboot: true } }];
    let expecteBinaryStrings = ['00 00 00'];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

    let binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function(val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request self_check', function() {
    let requestJson = [{ system: { self_check: true } }];
    let expecteBinaryStrings = ['0 03 0'];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

    let binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function(val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('ping', function() {
    let requestJson = [
      {
        system: {
          ping: { key: [0, 0, 1, 98, 144, 90, 221, 213, 0, 69, 123, 198] },
        },
      },
    ];

    let compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );
    expect(compress[0]).to.be.deep.equal(0);
    expect(compress[1]).to.be.deep.equal(8);
  });

  it('pong', function() {
    let responseBinaryString =
      '0 8 1c 0 0 1 62 9e 60 f7 22 0 0 1 62 9e 60 f6 6e 0 0 1 62 9e 60 f6 65 0 0 0 2';

    // let expectJson  = [{"system":{"pong":{"key":[0,0,1,98,158,96,246,101,0,0,0,2],"obnizTime":1523075577634,"pingServerTime":1523075577454,"pongServerTime":1524037003191}}}];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json[0]).to.have.any.keys('system');
  });
});
