const chai = require('chai');
const expect = chai.expect;

const testUtil = require('../../../testUtil.js');

describe('io.log', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this, null, { binary: true });
  });

  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('request test no.0', function () {
    const requestJson = [{ io0: true }];
    const expecteBinaryStrings = ['02 00 02 00 01'];

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
    const requestJson = [{ io7: { direction: 'input', stream: true } }];
    const expecteBinaryStrings = ['02 01 01 07'];

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

  it('response test no.2', function () {
    const responseBinaryString = '02 01 02 07 00';
    const expectJson = [{ io7: false }];

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

  it('response test no.3', function () {
    const responseBinaryString = '02 01 02 07 01';
    const expectJson = [{ io7: true }];

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

  it('response test no.4', function () {
    const responseBinaryString = '02 01 02 07 00';
    const expectJson = [{ io7: false }];

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

  it('response test no.5', function () {
    const responseBinaryString = '02 01 02 07 01';
    const expectJson = [{ io7: true }];

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

  it('response test no.6', function () {
    const responseBinaryString = '02 01 02 07 00';
    const expectJson = [{ io7: false }];

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

  it('response test no.7', function () {
    const responseBinaryString = '02 01 02 07 01';
    const expectJson = [{ io7: true }];

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

  it('response test no.8', function () {
    const responseBinaryString = '02 01 02 07 00';
    const expectJson = [{ io7: false }];

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

  it('response test no.9', function () {
    const responseBinaryString = '02 01 02 07 01';
    const expectJson = [{ io7: true }];

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

  it('response test no.10', function () {
    const responseBinaryString = '02 01 02 07 00';
    const expectJson = [{ io7: false }];

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

  it('response test no.11', function () {
    const responseBinaryString = '02 01 02 07 01';
    const expectJson = [{ io7: true }];

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

  it('response test no.12', function () {
    const responseBinaryString = '02 01 02 07 00';
    const expectJson = [{ io7: false }];

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

  it('response test no.13', function () {
    const responseBinaryString = '02 01 02 07 01';
    const expectJson = [{ io7: true }];

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

  it('request output shortcut', function () {
    const requestJson = [{ io0: true }];
    const expecteBinaryStrings = ['02 00 02 00 01'];

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

  it('request output direction&amp;value', function () {
    const requestJson = [{ io0: { direction: 'output', value: true } }];
    const expecteBinaryStrings = ['02 00 02 00 01'];

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

  it('request output_type push-pull5v', function () {
    const requestJson = [{ io1: { output_type: 'push-pull5v' } }];
    const expecteBinaryStrings = ['02 03 02 01 00'];

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

  it('request output_type push-pull3v', function () {
    const requestJson = [{ io1: { output_type: 'push-pull3v' } }];
    const expecteBinaryStrings = ['02 03 02 01 02'];

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

  it('request output_type open-drain', function () {
    const requestJson = [{ io2: { output_type: 'open-drain' } }];
    const expecteBinaryStrings = ['02 03 02 02 03'];

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

  it('request pull-up5v', function () {
    const requestJson = [{ io3: { pull_type: 'pull-up5v' } }];
    const expecteBinaryStrings = ['02 04 02 03 03'];

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

  it('request pull-up3v', function () {
    const requestJson = [{ io4: { pull_type: 'pull-up3v' } }];
    const expecteBinaryStrings = ['02 04 02 04 01'];

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

  it('request pull-down', function () {
    const requestJson = [{ io5: { pull_type: 'pull-down' } }];
    const expecteBinaryStrings = ['02 04 02 05 02'];

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

  it('request float', function () {
    const requestJson = [{ io6: { pull_type: 'float' } }];
    const expecteBinaryStrings = ['02 04 02 06 00'];

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

  it('request input shortcut', function () {
    const requestJson = [{ io7: 'get' }];
    const expecteBinaryStrings = ['02 02 01 07'];

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

  it('request input object', function () {
    const requestJson = [{ io7: { direction: 'input', stream: true } }];
    const expecteBinaryStrings = ['02 01 01 07'];

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

  it('request inputWait', function () {
    const requestJson = [{ io8: { direction: 'input', stream: false } }];
    const expecteBinaryStrings = ['02 02 01 08'];

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

  it('response input', function () {
    const responseBinaryString = '02 01 02 07 01';
    const expectJson = [{ io7: true }];

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

  it('deinit', function () {
    const requestJson = [
      {
        io0: null,
      },
    ];
    const expecteBinaryStrings = ['02 05 01 00'];

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
