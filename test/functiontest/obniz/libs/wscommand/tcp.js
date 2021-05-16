const chai = require('chai');
const expect = chai.expect;
const testUtil = require('../../../testUtil.js');

describe('tcp.log', function () {
  beforeEach(async function () {
    await testUtil.setupObnizPromise(this, null, { binary: true });
  });

  afterEach(async function () {
    await testUtil.releaseObnizPromise(this);
  });

  it('tcp connect', function () {
    const requestJson = [
      {
        tcp0: {
          connect: {
            port: 8,
            domain: 'obniz.io',
          },
        },
      },
    ];
    const expecteBinaryStrings = ['0d 0 0b 00 00 08 6f 62 6e 69 7a 2e 69 6f'];

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

  it('tcp disconnect', function () {
    const requestJson = [
      {
        tcp0: {
          disconnect: true,
        },
      },
    ];
    const expecteBinaryStrings = ['0d 01 01 00'];

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

  it('tcp write', function () {
    const requestJson = [
      {
        tcp0: {
          write: {
            data: [0, 1, 2, 3, 4],
          },
        },
      },
    ];
    const expecteBinaryStrings = ['0d 03 06 00 00 01 02 03 04'];

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

  it('tcp response', function () {
    const responseBinaryString = '0d 04 03 00 12 98';
    const expectJson = [{ tcp0: { read: { data: [18, 152] } } }];

    const binaryArray = responseBinaryString
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    const binary = new Uint8Array(binaryArray);

    const json = this.obniz._binary2Json(binary);

    const isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });
});
