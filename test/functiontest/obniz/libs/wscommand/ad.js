let chai = require('chai');
let expect = chai.expect;

let testUtil = require('../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('ad', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done, { binary: true });
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('request test no.0', function() {
    let requestJson = [{ ad0: { stream: true } }];
    let expecteBinaryStrings = ['07 00 01 00'];

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
    let requestJson = [{ ad1: { stream: true } }];
    let expecteBinaryStrings = ['07 00 01 01'];

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
    let requestJson = [{ ad2: { stream: false } }];
    let expecteBinaryStrings = ['07 03 01 02'];

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

  it('request test no.3', function() {
    let requestJson = [{ ad3: { stream: true } }];
    let expecteBinaryStrings = ['07 00 01 03'];

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

  it('request test no.4', function() {
    let requestJson = [{ ad3: null }];
    let expecteBinaryStrings = ['07 01 01 03'];

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

  it('response test no.5', function() {
    let responseBinaryString = '07 02 03 01 00 01';
    let expectJson = [{ ad1: 0.01 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.6', function() {
    let responseBinaryString = '07 02 03 01 00 00';
    let expectJson = [{ ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.7', function() {
    let responseBinaryString = '07 02 03 01 00 01';
    let expectJson = [{ ad1: 0.01 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.8', function() {
    let responseBinaryString = '07 02 03 01 00 00';
    let expectJson = [{ ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.9', function() {
    let responseBinaryString = '07 02 03 01 00 01';
    let expectJson = [{ ad1: 0.01 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.10', function() {
    let responseBinaryString = '07 02 03 01 00 00';
    let expectJson = [{ ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.11', function() {
    let responseBinaryString = '07 02 03 01 00 01';
    let expectJson = [{ ad1: 0.01 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.12', function() {
    let responseBinaryString = '07 02 03 01 00 00';
    let expectJson = [{ ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.13', function() {
    let responseBinaryString = '07 02 03 01 00 01';
    let expectJson = [{ ad1: 0.01 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.14', function() {
    let responseBinaryString = '07 02 03 01 00 00';
    let expectJson = [{ ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.15', function() {
    let responseBinaryString = '07 02 03 01 01 f2';
    let expectJson = [{ ad1: 4.98 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.16', function() {
    let responseBinaryString = '07 02 03 01 00 00';
    let expectJson = [{ ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.17', function() {
    let responseBinaryString = '07 02 03 01 01 f3';
    let expectJson = [{ ad1: 4.99 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.18', function() {
    let responseBinaryString = '07 02 03 01 01 f0';
    let expectJson = [{ ad1: 4.96 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.19', function() {
    let responseBinaryString = '07 02 03 01 01 f3';
    let expectJson = [{ ad1: 4.99 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.20', function() {
    let responseBinaryString = '07 02 03 01 01 f2';
    let expectJson = [{ ad1: 4.98 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.21', function() {
    let responseBinaryString = '07 02 03 01 01 f3';
    let expectJson = [{ ad1: 4.99 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.22', function() {
    let responseBinaryString = '07 02 03 01 01 f2';
    let expectJson = [{ ad1: 4.98 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.23', function() {
    let responseBinaryString = '07 02 03 01 01 f3';
    let expectJson = [{ ad1: 4.99 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.24', function() {
    let responseBinaryString = '07 02 03 01 01 f2';
    let expectJson = [{ ad1: 4.98 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.25', function() {
    let responseBinaryString = '07 02 03 01 01 f3';
    let expectJson = [{ ad1: 4.99 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.26', function() {
    let responseBinaryString = '07 02 03 01 00 00';
    let expectJson = [{ ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.27', function() {
    let responseBinaryString = '07 02 03 01 01 f3';
    let expectJson = [{ ad1: 4.99 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.28', function() {
    let responseBinaryString = '07 02 03 01 00 00';
    let expectJson = [{ ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.29', function() {
    let responseBinaryString = '07 02 03 01 00 01';
    let expectJson = [{ ad1: 0.01 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.30', function() {
    let responseBinaryString = '07 02 03 01 00 00';
    let expectJson = [{ ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.31', function() {
    let responseBinaryString = '07 02 03 01 00 01';
    let expectJson = [{ ad1: 0.01 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.32', function() {
    let responseBinaryString = '07 02 03 01 00 00';
    let expectJson = [{ ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.33', function() {
    let responseBinaryString = '07 02 03 01 00 02';
    let expectJson = [{ ad1: 0.02 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.34', function() {
    let responseBinaryString = '07 02 03 01 00 00';
    let expectJson = [{ ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.35', function() {
    let responseBinaryString = '07 02 03 01 00 01';
    let expectJson = [{ ad1: 0.01 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.36', function() {
    let responseBinaryString = '07 02 03 01 00 00';
    let expectJson = [{ ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.37', function() {
    let responseBinaryString = '07 02 03 01 00 01';
    let expectJson = [{ ad1: 0.01 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.38', function() {
    let responseBinaryString = '07 02 03 01 00 00';
    let expectJson = [{ ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.39', function() {
    let responseBinaryString = '07 02 03 01 00 03';
    let expectJson = [{ ad1: 0.03 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.40', function() {
    let responseBinaryString = '07 02 03 01 00 00';
    let expectJson = [{ ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test no.41', function() {
    let responseBinaryString = '07 02 03 00 00 00';
    let expectJson = [{ ad0: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response test 10bit mode', function() {
    let responseBinaryString = '07 02 03 00 83 FF';
    let expectJson = [{ ad0: 5.0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response double ad', function() {
    let responseBinaryString = '07 02 03 00 00 01 07 02 03 01 00 01';
    let expectJson = [{ ad0: 0.01 }, { ad1: 0.01 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response double ad2', function() {
    let responseBinaryString = '07 02 03 00 00 00 07 02 03 01 00 00';
    let expectJson = [{ ad0: 0 }, { ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response triple ad', function() {
    let responseBinaryString =
      '07 02 03 02 01 35 07 02 03 00 00 00 07 02 03 01 00 00';
    let expectJson = [{ ad2: 3.09 }, { ad0: 0 }, { ad1: 0 }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });
});
