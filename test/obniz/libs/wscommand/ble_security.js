const chai = require('chai');

const testUtil = require('../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('ble.security', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done, { binary: true });
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('auth', function() {
    let requestJson = [{ ble: { security: { auth: ['bonding'] } } }];
    let expecteBinaryStrings = ['b 23 01 1'];
    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('auth2', function() {
    let requestJson = [{ ble: { security: { auth: ['bonding', 'mitm'] } } }];
    let expecteBinaryStrings = ['b 23 01 5'];
    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('auth3', function() {
    let requestJson = [
      { ble: { security: { auth: ['bonding', 'mitm', 'secure_connection'] } } },
    ];
    let expecteBinaryStrings = ['b 23 01 d'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('auth4', function() {
    let requestJson = [{ ble: { security: { auth: ['secure_connection'] } } }];
    let expecteBinaryStrings = ['b 23 01 8'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('auth5', function() {
    let requestJson = [{ ble: { security: { auth: [] } } }];
    let expecteBinaryStrings = ['b 23 01 0'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('encryption_level1', function() {
    let requestJson = [{ ble: { security: { indicate_security_level: 1 } } }];
    let expecteBinaryStrings = ['b 24 01 1'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('encryption_level2', function() {
    let requestJson = [{ ble: { security: { indicate_security_level: 0 } } }];
    let expecteBinaryStrings = ['b 24 01 0'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('encryption_level3', function() {
    let requestJson = [{ ble: { security: { indicate_security_level: 3 } } }];
    let expecteBinaryStrings = ['b 24 01 3'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('enableKeyTypes1', function() {
    let requestJson = [{ ble: { security: { key: { type: ['ltk'] } } } }];
    let expecteBinaryStrings = ['b 25 01 1'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('enableKeyTypes2', function() {
    let requestJson = [{ ble: { security: { key: { type: [] } } } }];
    let expecteBinaryStrings = ['b 25 01 0'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('enableKeyTypes3', function() {
    let requestJson = [
      { ble: { security: { key: { type: ['ltk', 'irk'] } } } },
    ];
    let expecteBinaryStrings = ['b 25 01 3'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });
  it('enableKeyTypes4', function() {
    let requestJson = [
      { ble: { security: { key: { type: ['ltk', 'irk', 'csrk'] } } } },
    ];
    let expecteBinaryStrings = ['b 25 01 7'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });
  it('enableKeyTypes5', function() {
    let requestJson = [{ ble: { security: { key: { type: ['csrk'] } } } }];
    let expecteBinaryStrings = ['b 25 01 4'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('key size1', function() {
    let requestJson = [{ ble: { security: { key: { max_size: 16 } } } }];
    let expecteBinaryStrings = ['b 26 01 10'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });
  it('key size2', function() {
    let requestJson = [{ ble: { security: { key: { max_size: 7 } } } }];
    let expecteBinaryStrings = ['b 26 01 7'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });
  it('key size bad', function() {
    let requestJson = [{ ble: { security: { key: { max_size: 6 } } } }];
    let expecteBinaryStrings = ['b 26 01 6'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });
  it('clear devies ', function() {
    let requestJson = [{ ble: { security: { devices: { clear: true } } } }];
    let expecteBinaryStrings = ['b 28 0'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('receive error', function() {
    let requestBinaryString =
      'b ff 40 40 0 9 25 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3F';

    let expectedJson = [
      {
        ble: {
          error: {
            module_error_code: 0,
            error_code: 9,
            function_code: 37,
            address: '000000000000',
            service_uuid: null,
            characteristic_uuid: null,
            descriptor_uuid: null,
            message:
              'security param are already set on set security key type param',
          },
        },
      },
    ];

    testUtil.checkBinaryToJson(requestBinaryString, expectedJson, this);
  });
});
