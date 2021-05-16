const chai = require('chai');

const testUtil = require('../../../testUtil.js');

describe('ble.security', function () {
  beforeEach(async function () {
    await testUtil.setupObnizPromise(this, null, { binary: true });
  });

  afterEach(async function () {
    await testUtil.releaseObnizPromise(this);
  });

  it('auth', function () {
    const requestJson = [{ ble: { security: { auth: ['bonding'] } } }];
    const expecteBinaryStrings = ['b 23 01 1'];
    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('auth2', function () {
    const requestJson = [{ ble: { security: { auth: ['bonding', 'mitm'] } } }];
    const expecteBinaryStrings = ['b 23 01 5'];
    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('auth3', function () {
    const requestJson = [
      { ble: { security: { auth: ['bonding', 'mitm', 'secure_connection'] } } },
    ];
    const expecteBinaryStrings = ['b 23 01 d'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('auth4', function () {
    const requestJson = [
      { ble: { security: { auth: ['secure_connection'] } } },
    ];
    const expecteBinaryStrings = ['b 23 01 8'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('auth5', function () {
    const requestJson = [{ ble: { security: { auth: [] } } }];
    const expecteBinaryStrings = ['b 23 01 0'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('encryption_level1', function () {
    const requestJson = [{ ble: { security: { indicate_security_level: 1 } } }];
    const expecteBinaryStrings = ['b 24 01 1'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('encryption_level2', function () {
    const requestJson = [{ ble: { security: { indicate_security_level: 0 } } }];
    const expecteBinaryStrings = ['b 24 01 0'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('encryption_level3', function () {
    const requestJson = [{ ble: { security: { indicate_security_level: 3 } } }];
    const expecteBinaryStrings = ['b 24 01 3'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('enableKeyTypes1', function () {
    const requestJson = [{ ble: { security: { key: { type: ['ltk'] } } } }];
    const expecteBinaryStrings = ['b 25 01 1'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('enableKeyTypes2', function () {
    const requestJson = [{ ble: { security: { key: { type: [] } } } }];
    const expecteBinaryStrings = ['b 25 01 0'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('enableKeyTypes3', function () {
    const requestJson = [
      { ble: { security: { key: { type: ['ltk', 'irk'] } } } },
    ];
    const expecteBinaryStrings = ['b 25 01 3'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });
  it('enableKeyTypes4', function () {
    const requestJson = [
      { ble: { security: { key: { type: ['ltk', 'irk', 'csrk'] } } } },
    ];
    const expecteBinaryStrings = ['b 25 01 7'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });
  it('enableKeyTypes5', function () {
    const requestJson = [{ ble: { security: { key: { type: ['csrk'] } } } }];
    const expecteBinaryStrings = ['b 25 01 4'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('key size1', function () {
    const requestJson = [{ ble: { security: { key: { max_size: 16 } } } }];
    const expecteBinaryStrings = ['b 26 01 10'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });
  it('key size2', function () {
    const requestJson = [{ ble: { security: { key: { max_size: 7 } } } }];
    const expecteBinaryStrings = ['b 26 01 7'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });
  it('key size bad', function () {
    const requestJson = [{ ble: { security: { key: { max_size: 6 } } } }];
    const expecteBinaryStrings = ['b 26 01 6'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });
  it('clear devies ', function () {
    const requestJson = [{ ble: { security: { devices: { clear: true } } } }];
    const expecteBinaryStrings = ['b 28 0'];

    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('receive error', function () {
    const requestBinaryString =
      'b ff 40 40 0 9 25 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3F';

    const expectedJson = [
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
