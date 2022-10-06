const chai = require('chai');
const expect = chai.expect;
const testUtil = require('../../../testUtil.js');

describe('system.log', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this, null, { binary: true });
  });

  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('request test no.0', function () {
    const requestJson = [{ system: { wait: 100 } }];
    const expecteBinaryStrings = ['00 04 02 00 64'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request test no.1', function () {
    const requestJson = [{ system: { keep_working_at_offline: false } }];
    const expecteBinaryStrings = ['00 05 01 01'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request test no.2', function () {
    const requestJson = [{ system: { reset: true } }];
    const expecteBinaryStrings = ['00 02 00'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('debug warning', function () {
    const responseBinaryString = '0 9 3 0 1 dc';
    const expectJson = [
      {
        debug: {
          warning: {
            message: 'Low Voltage 4.76v. connect obniz to more powerful USB.',
          },
        },
      },
    ];

    const binaryArray = responseBinaryString
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    const binary = new Uint8Array(binaryArray);

    const json = this.obniz.wsCommandManager.binary2Json(binary);

    const isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('request reboot', function () {
    const requestJson = [{ system: { reboot: true } }];
    const expecteBinaryStrings = ['00 00 00'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request self_check', function () {
    const requestJson = [{ system: { self_check: true } }];
    const expecteBinaryStrings = ['0 03 0'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('ping', function () {
    const requestJson = [
      {
        system: {
          ping: { key: [0, 0, 1, 98, 144, 90, 221, 213, 0, 69, 123, 198] },
        },
      },
    ];

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);
    expect(compress[0]).to.be.deep.equal(0);
    expect(compress[1]).to.be.deep.equal(8);
  });

  it('pong', function () {
    const responseBinaryString =
      '0 8 1c 0 0 1 62 9e 60 f7 22 0 0 1 62 9e 60 f6 6e 0 0 1 62 9e 60 f6 65 0 0 0 2';

    // let expectJson  = [{"system":{"pong":{"key":[0,0,1,98,158,96,246,101,0,0,0,2],"obnizTime":1523075577634,"pingServerTime":1523075577454,"pongServerTime":1524037003191}}}];

    const binaryArray = responseBinaryString
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    const binary = new Uint8Array(binaryArray);

    const json = this.obniz.wsCommandManager.binary2Json(binary);

    const isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json[0]).to.have.any.keys('system');
  });

  it('request sleepSeconds', function () {
    const requestJson = [{ system: { sleep_seconds: 5 } }];
    const expecteBinaryStrings = ['00 A 2 00 5'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request sleepMinute', function () {
    const requestJson = [{ system: { sleep_minute: 5 } }];
    const expecteBinaryStrings = ['00 B 2 00 5'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request sleepIoTrigger', function () {
    const requestJson = [{ system: { sleep_io_trigger: true } }];
    const expecteBinaryStrings = ['00 C 1 1'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });
});
