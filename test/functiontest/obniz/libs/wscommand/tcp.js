let chai = require('chai');
let expect = chai.expect;
let testUtil = require('../../../testUtil.js');

describe('tcp.log', function () {
  beforeEach(async function () {
    await testUtil.setupObnizPromise(this, null, { binary: true });
  });

  afterEach(async function () {
    await testUtil.releaseObnizePromise(this);
  });

  it('tcp connect', function () {
    let requestJson = [
      {
        tcp0: {
          connect: {
            port: 8,
            domain: 'obniz.io',
          },
        },
      },
    ];
    let expecteBinaryStrings = ['0d 0 0b 00 00 08 6f 62 6e 69 7a 2e 69 6f'];

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
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('tcp disconnect', function () {
    let requestJson = [
      {
        tcp0: {
          disconnect: true,
        },
      },
    ];
    let expecteBinaryStrings = ['0d 01 01 00'];

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
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('tcp write', function () {
    let requestJson = [
      {
        tcp0: {
          write: {
            data: [0, 1, 2, 3, 4],
          },
        },
      },
    ];
    let expecteBinaryStrings = ['0d 03 06 00 00 01 02 03 04'];

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
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('tcp response', function () {
    let responseBinaryString = '0d 04 03 00 12 98';
    let expectJson = [{ tcp0: { read: { data: [18, 152] } } }];

    let binaryArray = responseBinaryString
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz._binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });
});
