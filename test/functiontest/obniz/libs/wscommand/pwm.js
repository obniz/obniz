const chai = require('chai');
const expect = chai.expect;

const testUtil = require('../../../testUtil.js');

describe('pwm.log', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this, null, { binary: true });
  });

  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('request test no.0', function () {
    const requestJson = [{ pwm0: { io: 11 } }];
    const expecteBinaryStrings = ['03 00 02 00 0b'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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
    const requestJson = [{ pwm0: { freq: 1000 } }];
    const expecteBinaryStrings = ['03 02 05 00 00 00 03 e8'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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
    const requestJson = [{ pwm0: { pulse: 0.5 } }];
    const expecteBinaryStrings = ['03 03 05 00 00 00 01 f4'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('request test no.3', function () {
    const requestJson = [{ pwm0: null }];
    const expecteBinaryStrings = ['03 01 01 00'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('request test no.4', function () {
    const requestJson = [{ pwm0: { io: 10 } }];
    const expecteBinaryStrings = ['03 00 02 00 0a'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('request test no.5', function () {
    const requestJson = [{ pwm0: { freq: 200 } }];
    const expecteBinaryStrings = ['03 02 05 00 00 00 00 c8'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('request test no.6', function () {
    const requestJson = [{ pwm1: { io: 1 } }];
    const expecteBinaryStrings = ['03 00 02 01 01'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('request test no.7', function () {
    const requestJson = [{ pwm1: { freq: 38000 } }];
    const expecteBinaryStrings = ['03 02 05 01 00 00 94 70'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('request test no.8', function () {
    const requestJson = [
      {
        pwm1: {
          modulate: {
            type: 'am',
            symbol_length: 0.07,
            data: [
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
            ],
          },
        },
      },
    ];
    const expecteBinaryStrings = [
      '03 04 40 68 01 00 00 00 46 ff 00 00 00 00 00 00 ff ff fe 01 c0 3e 03 ff fe 03 c0 3f ff c0 3c 03 e0 3e 03 ff fe 03 ff fe 03 e0 3e 03 e0 3f ff c0 3f ff e0 3e 3 e0 3e 3 e0 3e 3 e0 3e 3 f0 1f 3 f0 1f 1 f0 1f 1 ff ff 1 f0 1f 1 f0 1f 1 f8 1f 81 f0 1f ff f8 1f 81 f8 f 80 f8 f ff f8 f 80 f8 f 80 f8 f 80 fc f ff ff',
    ];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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
