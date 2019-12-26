const chai = require('chai');
const expect = chai.expect;

const testUtil = require('../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('ble.log', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done, { binary: true });
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('request test no.0', function() {
    let requestJson = [{ ble: { scan: { duration: 10 } } }];
    let expecteBinaryStrings = ['b 4 4 0 0 0 a'];

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

  it('response test no.1', function() {
    let responseBinaryString =
      'b 6 40 56 0 3d 97 3c b8 e0 50 2 1 3 ff ff ff cd 1e ff 6 0 1 9 20 0 bc 5 3f b0 df 8a 88 30 c 4e 83 f3 ea 3a 18 74 74 5b 52 df 11 97 8a 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1f 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: '50e0b83c973d',
            device_type: 'ble',
            address_type: 'random',
            ble_event_type: 'non_connectable_advertising',
            rssi: -51,
            adv_data: [
              30,
              255,
              6,
              0,
              1,
              9,
              32,
              0,
              188,
              5,
              63,
              176,
              223,
              138,
              136,
              48,
              12,
              78,
              131,
              243,
              234,
              58,
              24,
              116,
              116,
              91,
              82,
              223,
              17,
              151,
              138,
            ],
            flag: 0,
            scan_resp: [],
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

  it('response test no.2', function() {
    let responseBinaryString =
      'b 6 40 56 0 78 3b d2 78 6b 9b 2 1 0 ff ff ff bf 2 1 6 13 ff 4c 0 c e 0 ad 5a f0 9e ff f1 f4 75 b9 42 5d 7c ce 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 1 17 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: '9b6b78d23b78',
            device_type: 'ble',
            address_type: 'random',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -65,
            adv_data: [
              2,
              1,
              6,
              19,
              255,
              76,
              0,
              12,
              14,
              0,
              173,
              90,
              240,
              158,
              255,
              241,
              244,
              117,
              185,
              66,
              93,
              124,
              206,
            ],
            flag: 6,
            scan_resp: [],
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

  it('response test no.3', function() {
    let responseBinaryString =
      'b 6 40 56 0 f4 5c 89 ab 65 1a 2 0 0 ff ff ff bd 2 1 6 7 ff 4c 0 10 2 b 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 1 b 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: '1a65ab895cf4',
            device_type: 'ble',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -67,
            adv_data: [2, 1, 6, 7, 255, 76, 0, 16, 2, 11, 0],
            flag: 6,
            scan_resp: [],
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

  it('response test no.4', function() {
    let responseBinaryString =
      'b 6 40 56 0 8c 85 90 18 e4 5 2 0 0 ff ff ff c9 2 1 6 7 ff 4c 0 10 2 b 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 1 b 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: '05e41890858c',
            device_type: 'ble',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -55,
            adv_data: [2, 1, 6, 7, 255, 76, 0, 16, 2, 11, 0],
            flag: 6,
            scan_resp: [],
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

  it('response test no.5', function() {
    let responseBinaryString =
      'b 6 40 56 0 50 ac 95 29 c5 b3 2 1 0 ff ff ff ca 2 1 6 13 ff 4c 0 c e 8 d8 65 bc 54 6a ef 9e 22 82 d9 2c 1c a6 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 1 17 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: 'b3c52995ac50',
            device_type: 'ble',
            address_type: 'random',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -54,
            adv_data: [
              2,
              1,
              6,
              19,
              255,
              76,
              0,
              12,
              14,
              8,
              216,
              101,
              188,
              84,
              106,
              239,
              158,
              34,
              130,
              217,
              44,
              28,
              166,
            ],
            flag: 6,
            scan_resp: [],
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

  it('response test no.6', function() {
    let responseBinaryString =
      'b 6 40 56 0 40 9f 38 ff 88 90 3 0 3 ff ff ff ac 3 3 9f fe 17 16 9f fe 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1c 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: '9088ff389f40',
            device_type: 'dumo',
            address_type: 'public',
            ble_event_type: 'non_connectable_advertising',
            rssi: -84,
            adv_data: [
              3,
              3,
              159,
              254,
              23,
              22,
              159,
              254,
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
            ],
            flag: 0,
            scan_resp: [],
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

  it('response test no.7', function() {
    let responseBinaryString =
      'b 6 40 56 1 0 0 0 0 23 3 20 6c cc 0 0 20 0 4c 13 8 80 30 c3 fd 3f 98 c5 fd 3f 0 0 0 0 0 0 0 0 1 0 0 0 cd cd 0 0 0 0 0 0 8 0 0 0 f8 f9 fc 3f 98 c5 fd 3f e0 c2 0 40 f6 c2 0 40 0 0 0 0 8d 22 8 40 1 0 40 8 f0 f8 0 0 0 19 0 0';
    let expectJson = [{ ble: { scan_result_finish: true } }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('request test no.8', function() {
    let requestJson = [{ ble: { scan: { duration: 10 } } }];
    let expecteBinaryStrings = ['b 4 4 0 0 0 a'];

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

  it('response test no.9', function() {
    let responseBinaryString =
      'b 6 40 56 0 29 9d 59 3b 2 e0 2 1 3 ff ff ff bd 1e ff 6 0 1 9 20 0 bc 5 3f b0 df 8a 88 30 c 4e 83 f3 ea 3a 18 74 74 5b 52 df 11 97 8a 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1f 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: 'e0023b599d29',
            device_type: 'ble',
            address_type: 'random',
            ble_event_type: 'non_connectable_advertising',
            rssi: -67,
            adv_data: [
              30,
              255,
              6,
              0,
              1,
              9,
              32,
              0,
              188,
              5,
              63,
              176,
              223,
              138,
              136,
              48,
              12,
              78,
              131,
              243,
              234,
              58,
              24,
              116,
              116,
              91,
              82,
              223,
              17,
              151,
              138,
            ],
            flag: 0,
            scan_resp: [],
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

  it('response test no.10', function() {
    let responseBinaryString =
      'b 6 40 56 0 f4 5c 89 ab 65 1a 2 0 0 ff ff ff b0 2 1 6 7 ff 4c 0 10 2 b 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 1 b 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: '1a65ab895cf4',
            device_type: 'ble',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -80,
            adv_data: [2, 1, 6, 7, 255, 76, 0, 16, 2, 11, 0],
            flag: 6,
            scan_resp: [],
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

  it('response test no.11', function() {
    let responseBinaryString =
      'b 6 40 56 0 78 3b d2 78 6b 9b 2 1 0 ff ff ff bd 2 1 6 13 ff 4c 0 c e 8 d1 5a 8a 99 a8 e3 53 da 57 89 b6 c4 e7 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 1 17 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: '9b6b78d23b78',
            device_type: 'ble',
            address_type: 'random',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -67,
            adv_data: [
              2,
              1,
              6,
              19,
              255,
              76,
              0,
              12,
              14,
              8,
              209,
              90,
              138,
              153,
              168,
              227,
              83,
              218,
              87,
              137,
              182,
              196,
              231,
            ],
            flag: 6,
            scan_resp: [],
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

  it('response test no.12', function() {
    let responseBinaryString =
      'b 6 40 56 0 8c 85 90 18 e4 5 2 0 0 ff ff ff cf 2 1 6 7 ff 4c 0 10 2 b 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 1 b 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: '05e41890858c',
            device_type: 'ble',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -49,
            adv_data: [2, 1, 6, 7, 255, 76, 0, 16, 2, 11, 0],
            flag: 6,
            scan_resp: [],
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

  it('response test no.13', function() {
    let responseBinaryString =
      'b 6 40 56 0 50 ac 95 29 c5 b3 2 1 0 ff ff ff d1 2 1 6 13 ff 4c 0 c e 8 f4 65 41 4a 77 60 fb b6 76 13 4b 88 fb 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 1 17 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: 'b3c52995ac50',
            device_type: 'ble',
            address_type: 'random',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -47,
            adv_data: [
              2,
              1,
              6,
              19,
              255,
              76,
              0,
              12,
              14,
              8,
              244,
              101,
              65,
              74,
              119,
              96,
              251,
              182,
              118,
              19,
              75,
              136,
              251,
            ],
            flag: 6,
            scan_resp: [],
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

  it('response test no.14', function() {
    let responseBinaryString =
      'b 6 40 56 0 50 e3 39 7a 8b 57 2 1 0 ff ff ff df 2 1 1a a ff 4c 0 10 5 b 10 ca e5 8 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1a 0 0 0 1 e 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: '578b7a39e350',
            device_type: 'ble',
            address_type: 'random',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -33,
            adv_data: [2, 1, 26, 10, 255, 76, 0, 16, 5, 11, 16, 202, 229, 8],
            flag: 26,
            scan_resp: [],
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

  it('response test no.15', function() {
    let responseBinaryString =
      'b 6 40 56 0 0 7 80 78 f6 e5 3 0 0 ff ff ff b7 2 1 1a 1a ff 4c 0 2 15 c9 61 ac a7 94 a6 40 78 b1 ff 96 2c b2 55 cc db 78 b0 68 a c8 16 9 53 6d 61 70 6f 2d 53 65 72 76 69 63 65 37 38 3a 46 36 3a 45 35 0 0 0 0 0 0 0 0 0 0 0 0 1a 0 0 0 1 1e 17';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: 'e5f678800700',
            device_type: 'dumo',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -73,
            adv_data: [
              2,
              1,
              26,
              26,
              255,
              76,
              0,
              2,
              21,
              201,
              97,
              172,
              167,
              148,
              166,
              64,
              120,
              177,
              255,
              150,
              44,
              178,
              85,
              204,
              219,
              120,
              176,
              104,
              10,
              200,
            ],
            scan_resp: [
              22,
              9,
              83,
              109,
              97,
              112,
              111,
              45,
              83,
              101,
              114,
              118,
              105,
              99,
              101,
              55,
              56,
              58,
              70,
              54,
              58,
              69,
              53,
            ],
            flag: 26,
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

  it('response test no.16', function() {
    let responseBinaryString =
      'b 6 40 56 1 0 0 0 0 23 d 20 cc cc 0 0 20 0 4c 13 8 80 30 c3 fd 3f 98 c5 fd 3f 0 0 0 0 0 0 0 0 1 0 0 0 cd cd 0 0 0 0 0 0 8 0 0 0 f8 f9 fc 3f 98 c5 fd 3f e0 c2 0 40 f6 c2 0 40 0 0 0 0 8d 22 8 40 1 0 40 8 f0 f8 0 0 0 78 0 0';
    let expectJson = [{ ble: { scan_result_finish: true } }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('request test no.17', function() {
    let requestJson = [{ ble: { connect: { address: 'e5f678800700' } } }];
    let expecteBinaryStrings = ['b 7 7 0 7 80 78 f6 e5 0'];

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

  it('disconnect', function() {
    let requestJson = [{ ble: { disconnect: { address: 'e5f678800700' } } }];
    let expecteBinaryStrings = ['b 7 7 0 7 80 78 f6 e5 1'];

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

  it('response test no.18', function() {
    let responseBinaryString = 'b 7 7 0 7 80 78 f6 e5 0';
    let expectJson = [
      {
        ble: {
          status_update: { address: 'e5f678800700', status: 'connected' },
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

  it('request test no.19', function() {
    let requestJson = [
      {
        ble: {
          write_characteristic: {
            address: 'e5f678800700',
            service_uuid: '3000',
            characteristic_uuid: '3002',
            data: [0, 1],
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      'b a 2d 0 7 80 78 f6 e5 0 2 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 2 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 1',
    ];

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

  it('request test no.20', function() {
    let requestJson = [
      {
        ble: {
          read_characteristic: {
            address: 'e5f678800700',
            service_uuid: '3000',
            characteristic_uuid: '3001',
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      'b b 2a 0 7 80 78 f6 e5 0 2 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 1 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
    ];

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

  it('response test no.21', function() {
    let responseBinaryString =
      'b a 2b 0 7 80 78 f6 e5 0 2 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 2 30 3f c 0 0 0 0 0 0 0 b9 a4 d 80 80 0';
    let expectJson = [
      {
        ble: {
          write_characteristic_result: {
            address: 'e5f678800700',
            service_uuid: '3000',
            characteristic_uuid: '3002',
            result: 'success',
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

  it('response test no.22', function() {
    let responseBinaryString =
      'b b 33 0 7 80 78 f6 e5 0 2 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 1 30 3f c 0 0 0 0 0 0 0 b9 a4 d 80 80 0 0 0 0 0 0 0 0 0';
    let expectJson = [
      {
        ble: {
          read_characteristic_result: {
            address: 'e5f678800700',
            service_uuid: '3000',
            characteristic_uuid: '3001',
            data: [0, 0, 0, 0, 0, 0, 0, 0],
            result: 'success',
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

  it('response test no.23', function() {
    let responseBinaryString = 'b 7 7 0 7 80 78 f6 e5 1';
    let expectJson = [
      {
        ble: {
          status_update: { address: 'e5f678800700', status: 'disconnected' },
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

  it('response test no.24', function() {
    let responseBinaryString = 'b 7 7 0 7 80 78 f6 e5 0';
    let expectJson = [
      {
        ble: {
          status_update: { address: 'e5f678800700', status: 'connected' },
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

  it('request test no.25', function() {
    let requestJson = [{ ble: { get_services: { address: 'e5f678800700' } } }];
    let expecteBinaryStrings = ['b 8 6 0 7 80 78 f6 e5'];

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

  it('request test no.26', function() {
    let requestJson = [
      {
        ble: {
          get_characteristics: {
            address: 'e5f678800700',
            service_uuid: '3000',
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      'b 9 18 0 7 80 78 f6 e5 0 2 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
    ];

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

  it('request test no.27', function() {
    let requestJson = [{ ble: { scan: { duration: 10 } } }];
    let expecteBinaryStrings = ['b 4 4 0 0 0 a'];

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

  it('response test no.28', function() {
    let responseBinaryString =
      'b 6 40 56 0 8c 85 90 18 e4 5 2 0 0 ff ff ff d3 2 1 6 7 ff 4c 0 10 2 b 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 1 b 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: '05e41890858c',
            device_type: 'ble',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -45,
            adv_data: [2, 1, 6, 7, 255, 76, 0, 16, 2, 11, 0],
            flag: 6,
            scan_resp: [],
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

  it('response test no.29', function() {
    let responseBinaryString =
      'b 6 40 56 0 50 ac 95 29 c5 b3 2 1 0 ff ff ff d4 2 1 6 13 ff 4c 0 c e 0 4c 66 84 51 e7 71 ce b9 a 98 0 93 21 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 1 17 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: 'b3c52995ac50',
            device_type: 'ble',
            address_type: 'random',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -44,
            adv_data: [
              2,
              1,
              6,
              19,
              255,
              76,
              0,
              12,
              14,
              0,
              76,
              102,
              132,
              81,
              231,
              113,
              206,
              185,
              10,
              152,
              0,
              147,
              33,
            ],
            flag: 6,
            scan_resp: [],
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

  it('response test no.30', function() {
    let responseBinaryString =
      'b 6 40 56 0 f4 5c 89 ab 65 1a 2 0 0 ff ff ff bd 2 1 6 7 ff 4c 0 10 2 b 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 1 b 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: '1a65ab895cf4',
            device_type: 'ble',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -67,
            adv_data: [2, 1, 6, 7, 255, 76, 0, 16, 2, 11, 0],
            flag: 6,
            scan_resp: [],
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

  it('response test no.31', function() {
    let responseBinaryString =
      'b 6 40 56 0 11 95 15 5d 80 3b 2 1 3 ff ff ff bb 1e ff 6 0 1 9 20 0 44 88 68 82 ef 83 8 63 4b 94 87 61 43 1b 63 7f 5d 89 d7 23 f 2c 65 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1f 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: '3b805d159511',
            device_type: 'ble',
            address_type: 'random',
            ble_event_type: 'non_connectable_advertising',
            rssi: -69,
            adv_data: [
              30,
              255,
              6,
              0,
              1,
              9,
              32,
              0,
              68,
              136,
              104,
              130,
              239,
              131,
              8,
              99,
              75,
              148,
              135,
              97,
              67,
              27,
              99,
              127,
              93,
              137,
              215,
              35,
              15,
              44,
              101,
            ],
            flag: 0,
            scan_resp: [],
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

  it('response test no.32', function() {
    let responseBinaryString =
      'b 6 40 56 0 78 3b d2 78 6b 9b 2 1 0 ff ff ff be 2 1 6 13 ff 4c 0 c e 8 5 5b 3e 1f 70 f0 e df b0 cd 13 96 76 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 1 17 0';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: '9b6b78d23b78',
            device_type: 'ble',
            address_type: 'random',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -66,
            adv_data: [
              2,
              1,
              6,
              19,
              255,
              76,
              0,
              12,
              14,
              8,
              5,
              91,
              62,
              31,
              112,
              240,
              14,
              223,
              176,
              205,
              19,
              150,
              118,
            ],
            flag: 6,
            scan_resp: [],
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

  it('response test no.33', function() {
    let responseBinaryString =
      'b 6 40 56 0 0 7 80 78 f6 e5 3 0 0 ff ff ff b7 2 1 1a 1a ff 4c 0 2 15 c9 61 ac a7 94 a6 40 78 b1 ff 96 2c b2 55 cc db 75 c4 68 a c8 16 9 53 6d 61 70 6f 2d 53 65 72 76 69 63 65 37 38 3a 46 36 3a 45 35 0 0 0 0 0 0 0 0 0 0 0 0 1a 0 0 0 1 1e 17';
    let expectJson = [
      {
        ble: {
          scan_result: {
            address: 'e5f678800700',
            device_type: 'dumo',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -73,
            adv_data: [
              2,
              1,
              26,
              26,
              255,
              76,
              0,
              2,
              21,
              201,
              97,
              172,
              167,
              148,
              166,
              64,
              120,
              177,
              255,
              150,
              44,
              178,
              85,
              204,
              219,
              117,
              196,
              104,
              10,
              200,
            ],
            scan_resp: [
              22,
              9,
              83,
              109,
              97,
              112,
              111,
              45,
              83,
              101,
              114,
              118,
              105,
              99,
              101,
              55,
              56,
              58,
              70,
              54,
              58,
              69,
              53,
            ],
            flag: 26,
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

  it('request test no.34', function() {
    let requestJson = [{ ble: { scan: null } }];
    let expecteBinaryStrings = ['b 5 0'];

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

  it('request test no.35', function() {
    let requestJson = [
      {
        ble: {
          get_characteristics: {
            address: 'e5f678800700',
            service_uuid: '3000',
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      'b 9 18 0 7 80 78 f6 e5 0 2 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
    ];

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

  it('response test no.36', function() {
    let responseBinaryString =
      'b ff 40 40 0 8 16 0 0 0 0 0 0 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0';
    let expectJson = [
      {
        ble: {
          error: {
            error_code: 8,
            module_error_code: 0,
            function_code: 22,
            address: '000000000000',
            service_uuid: 'fff0',
            characteristic_uuid: null,
            descriptor_uuid: null,
            message: 'service already running on adding service',
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

  it('request test no.37', function() {
    let requestJson = [{ ble: { peripheral: null } }];
    let expecteBinaryStrings = ['b 14 1 1'];

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

  it('response test no.38', function() {
    let responseBinaryString = 'b 15 7 63 99 61 75 58 8 1';
    let expectJson = [
      {
        ble: {
          peripheral: {
            connection_status: { address: '085875619963', status: 'connected' },
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

  it('response test no.39', function() {
    let responseBinaryString =
      'b 20 3c 63 99 61 75 58 8 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 1 29 0 0 0 0 0 0 0 0 0 0 0 0 0 0';
    let expectJson = [
      {
        ble: {
          peripheral: {
            notify_read_descriptor: {
              address: '085875619963',
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              descriptor_uuid: '2901',
            },
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

  it('response test no.40', function() {
    let responseBinaryString =
      'b 20 3c 63 99 61 75 58 8 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 2 29 0 0 0 0 0 0 0 0 0 0 0 0 0 0';
    let expectJson = [
      {
        ble: {
          peripheral: {
            notify_read_descriptor: {
              address: '085875619963',
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              descriptor_uuid: '2902',
            },
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

  it('response test no.41', function() {
    let responseBinaryString =
      'b 1c 2a 63 99 61 75 58 8 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0';
    let expectJson = [
      {
        ble: {
          peripheral: {
            notify_read_characteristic: {
              address: '085875619963',
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
            },
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

  it('request test no.42', function() {
    let requestJson = [
      {
        ble: {
          peripheral: {
            write_characteristic: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              data: [0],
            },
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      'b 19 25 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
    ];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let WSCommand = this.obniz.constructor.WSCommand;
    let compress = WSCommand.compress(this.obniz.wscommands, requestJson[0]);

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

  it('response test no.43', function() {
    let responseBinaryString =
      'b 19 25 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0';
    let expectJson = [
      {
        ble: {
          peripheral: {
            write_characteristic_result: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              result: 'success',
            },
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

  it('response test no.44', function() {
    let responseBinaryString =
      'b 1c 2a 63 99 61 75 58 8 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0';
    let expectJson = [
      {
        ble: {
          peripheral: {
            notify_read_characteristic: {
              address: '085875619963',
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
            },
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

  it('response test no.45', function() {
    let responseBinaryString =
      'b 1c 2a 63 99 61 75 58 8 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0';
    let expectJson = [
      {
        ble: {
          peripheral: {
            notify_read_characteristic: {
              address: '085875619963',
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
            },
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

  it('request test no.46', function() {
    let requestJson = [
      {
        ble: {
          peripheral: {
            write_characteristic: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              data: [1],
            },
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      'b 19 25 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1',
    ];

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

  it('request test no.47', function() {
    let requestJson = [
      {
        ble: {
          peripheral: {
            write_characteristic: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              data: [2],
            },
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      'b 19 25 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2',
    ];

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

  it('response test no.48', function() {
    let responseBinaryString =
      'b 1b 2c 63 99 61 75 58 8 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 59';
    let expectJson = [
      {
        ble: {
          peripheral: {
            notify_write_characteristic: {
              address: '085875619963',
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              data: [2, 89],
            },
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

  it('response test no.49', function() {
    let responseBinaryString =
      'b 1c 2a 63 99 61 75 58 8 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0';
    let expectJson = [
      {
        ble: {
          peripheral: {
            notify_read_characteristic: {
              address: '085875619963',
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
            },
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

  it('request test no.50', function() {
    let requestJson = [
      {
        ble: {
          peripheral: {
            read_characteristic: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
            },
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      'b 1a 24 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
    ];

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

  it('request test no.51', function() {
    let requestJson = [
      {
        ble: {
          peripheral: {
            write_characteristic: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              data: [3],
            },
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      'b 19 25 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3',
    ];

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

  it('response test no.52', function() {
    let responseBinaryString =
      'b 1a 26 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 59';
    let expectJson = [
      {
        ble: {
          peripheral: {
            read_characteristic_result: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              data: [2, 89],
              result: 'success',
            },
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

  it('response test no.53', function() {
    let responseBinaryString =
      'b 19 25 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0';
    let expectJson = [
      {
        ble: {
          peripheral: {
            write_characteristic_result: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              result: 'success',
            },
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

  it('response test no.54', function() {
    let responseBinaryString =
      'b 1c 2a 63 99 61 75 58 8 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0';
    let expectJson = [
      {
        ble: {
          peripheral: {
            notify_read_characteristic: {
              address: '085875619963',
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
            },
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

  it('request test no.55', function() {
    let requestJson = [
      {
        ble: {
          peripheral: {
            write_characteristic: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              data: [4],
            },
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      'b 19 25 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 4',
    ];

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

  it('response test no.56', function() {
    let responseBinaryString =
      'b 19 25 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0';
    let expectJson = [
      {
        ble: {
          peripheral: {
            write_characteristic_result: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              result: 'success',
            },
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

  it('request advertise', function() {
    let requestJson = [
      {
        ble: {
          advertisement: {
            adv_data: [2, 1, 26, 7, 9, 83, 97, 109, 112, 108, 101],
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      '0b 00 0b 02 01 1a 07 09 53 61 6d 70 6c 65',
      '0b 02 00',
    ];

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

  it('request stop advertise', function() {
    let requestJson = [{ ble: { advertisement: null } }];
    let expecteBinaryStrings = ['0b 03 0'];

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

  it('request scanresp', function() {
    let requestJson = [
      {
        ble: {
          advertisement: {
            adv_data: [2, 1, 26, 7, 9, 83, 97, 109, 112, 108, 101],
            scan_resp: [7, 9, 83, 97, 109, 112, 108, 101],
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      '0b 00 0b 02 01 1a 07 09 53 61 6d 70 6c 65',
      '0b 01 08 07 09 53 61 6d 70 6c 65',
      '0b 02 00',
    ];

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

  it('request set service', function() {
    let requestJson = [
      {
        ble: {
          peripheral: {
            services: [
              {
                uuid: 'ffe0',
                characteristics: [
                  { uuid: 'fff1', data: [72, 105], descriptors: [] },
                ],
              },
            ],
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      'b 16 12 0 2 e0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
      'b 17 29 0 2 e0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 11 a 48 69',
      'b 22 13 0 2 e0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
    ];

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

  it('request set service2', function() {
    let requestJson = [
      {
        ble: {
          peripheral: {
            services: [
              {
                uuid: 'fff0',
                characteristics: [
                  {
                    uuid: 'fff1',
                    data: [72, 105],
                    descriptors: [{ uuid: '00ff', data: [1, 2] }],
                  },
                ],
              },
            ],
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      'b 16 12 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
      'b 17 29 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 11 a 48 69',
      'b 18 3a 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 11 1 2',
      'b 22 13 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
    ];

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

  it('response get_service_result', function() {
    let responseBinaryString =
      'b 8 18 0 7 80 78 f6 e5 0 2 0 18 0 0 0 0 0 0 0 0 0 0 0 0 0 0 b 8 18 0 7 80 78 f6 e5 0 2 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0';
    let expectJson = [
      {
        ble: {
          get_service_result: { address: 'e5f678800700', service_uuid: '1800' },
        },
      },
      {
        ble: {
          get_service_result: { address: 'e5f678800700', service_uuid: '3000' },
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

  it('response get_service_result_finish', function() {
    let binaryArray = [
      11,
      8,
      24,
      111,
      8,
      224,
      40,
      78,
      101,
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
    ];
    let expectJson = [
      { ble: { get_service_result_finish: { address: '654e28e0086f' } } },
    ];
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response get_characteristic_result1', function() {
    let responseBinaryString =
      'b 9 2b 0 7 80 78 f6 e5 0 2 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 0 30 3f c 0 0 0 0 0 0 0 b9 a4 d 80 80 00 ' +
      'b 9 2b 0 7 80 78 f6 e5 0 2 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 1 30 3f c 0 0 0 0 0 0 0 b9 a4 d 80 80 0a ' +
      'b 9 2b 0 7 80 78 f6 e5 0 2 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 2 30 3f c 0 0 0 0 0 0 0 b9 a4 d 80 80 84';
    let expectJson = [
      {
        ble: {
          get_characteristic_result: {
            address: 'e5f678800700',
            service_uuid: '3000',
            characteristic_uuid: '3000',
            properties: [],
          },
        },
      },
      {
        ble: {
          get_characteristic_result: {
            address: 'e5f678800700',
            service_uuid: '3000',
            characteristic_uuid: '3001',
            properties: ['read', 'write'],
          },
        },
      },
      {
        ble: {
          get_characteristic_result: {
            address: 'e5f678800700',
            service_uuid: '3000',
            characteristic_uuid: '3002',
            properties: ['write_without_response', 'extended_properties'],
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

  it('response get_characteristic_result2', function() {
    let responseBinaryString =
      'b 9 2b 0 7 80 78 f6 e5 0 2 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 0 30 3f c 0 0 0 0 0 0 0 b9 a4 d 80 80 00 ' +
      'b 9 2b 0 7 80 78 f6 e5 0 2 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 1 30 3f c 0 0 0 0 0 0 0 b9 a4 d 80 80 00 ' +
      'b 9 2b 0 7 80 78 f6 e5 0 2 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 2 30 3f c 0 0 0 0 0 0 0 b9 a4 d 80 80 00';
    let expectJson = [
      {
        ble: {
          get_characteristic_result: {
            address: 'e5f678800700',
            service_uuid: '3000',
            characteristic_uuid: '3000',
            properties: [],
          },
        },
      },
      {
        ble: {
          get_characteristic_result: {
            address: 'e5f678800700',
            service_uuid: '3000',
            characteristic_uuid: '3001',
            properties: [],
          },
        },
      },
      {
        ble: {
          get_characteristic_result: {
            address: 'e5f678800700',
            service_uuid: '3000',
            characteristic_uuid: '3002',
            properties: [],
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

  it('response write_characteristic_result', function() {
    let responseBinaryString =
      'b 19 25 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 b 19 25 0 2 f0 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 f1 ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0';
    let expectJson = [
      {
        ble: {
          peripheral: {
            write_characteristic_result: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              result: 'success',
            },
          },
        },
      },
      {
        ble: {
          peripheral: {
            write_characteristic_result: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              result: 'success',
            },
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

  it('response get_characteristic_result3', function() {
    let binaryArray = [
      11,
      9,
      43,
      111,
      8,
      224,
      40,
      78,
      101,
      0,
      2,
      0,
      48,
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
      2,
      0,
      48,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      209,
      4,
      17,
      128,
      144,
      0,
    ];

    let expectJson = [
      {
        ble: {
          get_characteristic_result: {
            address: '654e28e0086f',
            service_uuid: '3000',
            characteristic_uuid: '3000',
            properties: [],
          },
        },
      },
    ];
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response get_characteristic_result4', function() {
    let binaryArray = [
      11,
      9,
      43,
      111,
      8,
      224,
      40,
      78,
      101,
      0,
      2,
      0,
      48,
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
      2,
      0,
      48,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      209,
      4,
      17,
      128,
      144,
      0,
      11,
      9,
      43,
      111,
      8,
      224,
      40,
      78,
      101,
      0,
      2,
      0,
      48,
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
      2,
      1,
      48,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      209,
      4,
      17,
      128,
      144,
      0,
      11,
      9,
      43,
      111,
      8,
      224,
      40,
      78,
      101,
      0,
      2,
      0,
      48,
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
      2,
      2,
      48,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      209,
      4,
      17,
      128,
      144,
      0,
      11,
      9,
      43,
      111,
      8,
      224,
      40,
      78,
      101,
      0,
      2,
      0,
      48,
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
    ];

    let expectJson = [
      {
        ble: {
          get_characteristic_result: {
            address: '654e28e0086f',
            service_uuid: '3000',
            characteristic_uuid: '3000',
            properties: [],
          },
        },
      },
      {
        ble: {
          get_characteristic_result: {
            address: '654e28e0086f',
            service_uuid: '3000',
            characteristic_uuid: '3001',
            properties: [],
          },
        },
      },
      {
        ble: {
          get_characteristic_result: {
            address: '654e28e0086f',
            service_uuid: '3000',
            characteristic_uuid: '3002',
            properties: [],
          },
        },
      },
      {
        ble: {
          get_characteristic_result_finish: {
            address: '654e28e0086f',
            service_uuid: '3000',
          },
        },
      },
    ];
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response get_characteristic_finish', function() {
    let binaryArray = [
      11,
      9,
      43,
      111,
      8,
      224,
      40,
      78,
      101,
      0,
      2,
      0,
      48,
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
    ];

    let expectJson = [
      {
        ble: {
          get_characteristic_result_finish: {
            address: '654e28e0086f',
            service_uuid: '3000',
          },
        },
      },
    ];
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response get_descriptor', function() {
    let requestJson = [
      {
        ble: {
          get_descriptors: {
            address: 'e5f678800700',
            service_uuid: 'FF00',
            characteristic_uuid: 'FF01',
          },
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

    let binaryArray = [
      11,
      14,
      42,
      0,
      7,
      128,
      120,
      246,
      229,
      0,
      2,
      0,
      255,
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
      2,
      1,
      255,
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
    ];

    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('response get_descriptor_result', function() {
    let binaryArray = [
      11,
      14,
      60,
      101,
      30,
      129,
      87,
      138,
      172,
      0,
      16,
      220,
      248,
      85,
      173,
      2,
      197,
      244,
      142,
      58,
      67,
      54,
      15,
      43,
      80,
      211,
      137,
      0,
      16,
      215,
      213,
      187,
      112,
      168,
      163,
      171,
      166,
      216,
      70,
      171,
      35,
      140,
      243,
      178,
      198,
      0,
      2,
      0,
      41,
      98,
      98,
      32,
      55,
      48,
      32,
      97,
      56,
      32,
      97,
      64,
      15,
      17,
      128,
    ];

    let expectJson = [
      {
        ble: {
          get_descriptor_result: {
            address: 'ac8a57811e65',
            service_uuid: '89d3502b0f36433a8ef4c502ad55f8dc',
            characteristic_uuid: 'c6b2f38c23ab46d8a6aba3a870bbd5d7',
            descriptor_uuid: '2900',
          },
        },
      },
    ];

    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response get_descriptor_result_finish', function() {
    let binaryArray = [
      11,
      14,
      60,
      101,
      30,
      129,
      87,
      138,
      172,
      0,
      16,
      220,
      248,
      85,
      173,
      2,
      197,
      244,
      142,
      58,
      67,
      54,
      15,
      43,
      80,
      211,
      137,
      0,
      16,
      215,
      213,
      187,
      112,
      168,
      163,
      171,
      166,
      216,
      70,
      171,
      35,
      140,
      243,
      178,
      198,
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
    ];

    let expectJson = [
      {
        ble: {
          get_descriptor_result_finish: {
            address: 'ac8a57811e65',
            service_uuid: '89d3502b0f36433a8ef4c502ad55f8dc',
            characteristic_uuid: 'c6b2f38c23ab46d8a6aba3a870bbd5d7',
          },
        },
      },
    ];

    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('request read_descriptor', function() {
    let requestJson = [
      {
        ble: {
          read_descriptor: {
            address: '84edf3b7694f',
            service_uuid: '1801',
            characteristic_uuid: '2a05',
            descriptor_uuid: '2902',
          },
        },
      },
    ];
    let binaryArray = [
      11,
      16,
      60,
      79,
      105,
      183,
      243,
      237,
      132,
      0,
      2,
      1,
      24,
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
      2,
      5,
      42,
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
      2,
      2,
      41,
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
    ];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('response read_descriptor_result', function() {
    let binaryArray = [
      11,
      16,
      63,
      79,
      105,
      183,
      243,
      237,
      132,
      0,
      2,
      0,
      48,
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
      2,
      2,
      48,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      209,
      4,
      17,
      128,
      32,
      0,
      2,
      0,
      41,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      64,
      15,
      17,
      128,
      0,
      1,
      0,
    ];
    let expectJson = [
      {
        ble: {
          read_descriptor_result: {
            address: '84edf3b7694f',
            service_uuid: '3000',
            characteristic_uuid: '3002',
            descriptor_uuid: '2900',
            data: [1, 0],
            result: 'success',
          },
        },
      },
    ];
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('request write_descriptor', function() {
    let requestJson = [
      {
        ble: {
          write_descriptor: {
            address: '84edf3b7694f',
            service_uuid: 'd0611e78bbb44591a5f8487910ae4366',
            characteristic_uuid: '8667556c9a374c9184ed54ee27d90049',
            descriptor_uuid: '2900',
            data: [1, 0],
          },
        },
      },
    ];
    let binaryArray = [
      11,
      15,
      63,
      79,
      105,
      183,
      243,
      237,
      132,
      0,
      16,
      102,
      67,
      174,
      16,
      121,
      72,
      248,
      165,
      145,
      69,
      180,
      187,
      120,
      30,
      97,
      208,
      0,
      16,
      73,
      0,
      217,
      39,
      238,
      84,
      237,
      132,
      145,
      76,
      55,
      154,
      108,
      85,
      103,
      134,
      0,
      2,
      0,
      41,
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
      0,
    ];
    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('response write_descriptor_result', function() {
    let binaryArray = [
      11,
      15,
      61,
      79,
      105,
      183,
      243,
      237,
      132,
      0,
      2,
      0,
      48,
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
      2,
      2,
      48,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      209,
      4,
      17,
      128,
      32,
      0,
      2,
      0,
      41,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      64,
      15,
      17,
      128,
      0,
    ];
    let expectJson = [
      {
        ble: {
          write_descriptor_result: {
            address: '84edf3b7694f',
            service_uuid: '3000',
            characteristic_uuid: '3002',
            descriptor_uuid: '2900',
            result: 'success',
          },
        },
      },
    ];
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('request peripheral write_descriptor', function() {
    let requestJson = [
      {
        ble: {
          peripheral: {
            write_descriptor: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              descriptor_uuid: '2901',
              data: [72, 69, 69, 69, 69, 69],
            },
          },
        },
      },
    ];
    let binaryArray = [
      11,
      29,
      60,
      0,
      2,
      240,
      255,
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
      2,
      241,
      255,
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
      2,
      1,
      41,
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
      72,
      69,
      69,
      69,
      69,
      69,
    ];
    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request peripheral read_descriptor', function() {
    let requestJson = [
      {
        ble: {
          peripheral: {
            read_descriptor: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              descriptor_uuid: '2901',
            },
          },
        },
      },
    ];
    let binaryArray = [
      11,
      30,
      54,
      0,
      2,
      240,
      255,
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
      2,
      241,
      255,
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
      2,
      1,
      41,
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
    ];
    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('response peripheral write_descriptor', function() {
    let binaryArray = [
      11,
      29,
      55,
      0,
      2,
      240,
      255,
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
      2,
      241,
      255,
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
      2,
      1,
      41,
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
    ];
    let expectJson = [
      {
        ble: {
          peripheral: {
            write_descriptor_result: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              descriptor_uuid: '2901',
              result: 'success',
            },
          },
        },
      },
    ];
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response peripheral read_descriptor', function() {
    let binaryArray = [
      11,
      30,
      64,
      80,
      0,
      2,
      240,
      255,
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
      2,
      241,
      255,
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
      2,
      1,
      41,
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
      104,
      101,
      108,
      108,
      111,
      32,
      119,
      114,
      111,
      108,
      100,
      32,
      99,
      104,
      97,
      114,
      97,
      99,
      116,
      101,
      114,
      105,
      115,
      116,
      105,
      99,
    ];
    let expectJson = [
      {
        ble: {
          peripheral: {
            read_descriptor_result: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              descriptor_uuid: '2901',
              result: 'success',
              data: [
                104,
                101,
                108,
                108,
                111,
                32,
                119,
                114,
                111,
                108,
                100,
                32,
                99,
                104,
                97,
                114,
                97,
                99,
                116,
                101,
                114,
                105,
                115,
                116,
                105,
                99,
              ],
            },
          },
        },
      },
    ];
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response peripheral notify_write_descriptor', function() {
    let binaryArray = [
      11,
      31,
      64,
      69,
      140,
      133,
      144,
      24,
      228,
      5,
      0,
      2,
      240,
      255,
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
      2,
      241,
      255,
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
      2,
      1,
      41,
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
      97,
      97,
      97,
      97,
      115,
      101,
      100,
      102,
      97,
    ];
    let expectJson = [
      {
        ble: {
          peripheral: {
            notify_write_descriptor: {
              address: '05e41890858c',
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              descriptor_uuid: '2901',
              data: [97, 97, 97, 97, 115, 101, 100, 102, 97],
            },
          },
        },
      },
    ];
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response peripheral notify_read_descriptor', function() {
    let binaryArray = [
      11,
      32,
      60,
      140,
      133,
      144,
      24,
      228,
      5,
      0,
      2,
      240,
      255,
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
      2,
      241,
      255,
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
      2,
      1,
      41,
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
    ];
    let expectJson = [
      {
        ble: {
          peripheral: {
            notify_read_descriptor: {
              address: '05e41890858c',
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              descriptor_uuid: '2901',
            },
          },
        },
      },
    ];
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('request notify unregister', function() {
    let requestJson = [
      {
        ble: {
          unregister_notify_characteristic: {
            address: 'dc6b4da38352',
            service_uuid: '3000',
            characteristic_uuid: '3000',
          },
        },
      },
    ];
    let binaryArray = [
      11,
      13,
      42,
      82,
      131,
      163,
      77,
      107,
      220,
      0,
      2,
      0,
      48,
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
      2,
      0,
      48,
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
    ];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });
});
