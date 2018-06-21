let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');

let testUtil = require('../../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('ble', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done);
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('scan', function() {
    this.obniz.ble.scan.start(null, { duration: 10 });

    expect(this.obniz).send([{ ble: { scan: { duration: 10 } } }]);
    expect(this.obniz).to.be.finished;
  });
  it('scan default', function() {
    this.obniz.ble.scan.start();

    expect(this.obniz).send([{ ble: { scan: { duration: 30 } } }]);
    expect(this.obniz).to.be.finished;
  });
  it('scan stop', function() {
    this.obniz.ble.scan.start();

    expect(this.obniz).send([{ ble: { scan: { duration: 30 } } }]);
    this.obniz.ble.scan.end();
    expect(this.obniz).send([{ ble: { scan: null } }]);
    expect(this.obniz).to.be.finished;
  });

  it('callback default function onfind', function() {
    expect(this.obniz.ble.scan.onfind).to.have.not.throws();
  });
  it('callback default function onfindfinish', function() {
    expect(this.obniz.ble.scan.onfinish).to.have.not.throws();
  });

  it('on scan', function() {
    let stub = sinon.stub();

    this.obniz.ble.scan.onfind = stub;
    this.obniz.ble.scan.start();

    expect(this.obniz).send([{ ble: { scan: { duration: 30 } } }]);

    let results = [
      {
        ble: {
          scan_result: {
            address: 'e5f678800700',
            device_type: 'dumo',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -82,
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
              61,
              131,
              104,
              10,
              200,
            ],
            flag: 26,
            scan_resp: [
              22,
              9,
              83,
              83,
              83,
              83,
              83,
              83,
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
          },
        },
      },
    ];

    testUtil.receiveJson(this.obniz, results);

    sinon.assert.callCount(stub, 1);
    let peripheral = stub.getCall(0).args[0];
    expect(typeof peripheral === 'object').to.be.true;

    expect(peripheral.adv_data).to.be.deep.equal([
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
      61,
      131,
      104,
      10,
      200,
    ]);
    expect(peripheral.scan_resp).to.be.deep.equal([
      22,
      9,
      83,
      83,
      83,
      83,
      83,
      83,
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
    ]);
    expect(peripheral.localName).to.be.equal('SSSSSSService78:F6:E5');
    expect(peripheral.iBeacon).to.be.deep.equal({
      major: 15747,
      minor: 26634,
      power: 200,
      rssi: -82,
      uuid: 'c961aca7-94a6-4078-b1ff-962cb255ccdb',
    });

    expect(this.obniz).to.be.finished;
  });

  it('on scan2', function() {
    let stub = sinon.stub();

    this.obniz.ble.scan.onfind = stub;
    this.obniz.ble.scan.start();

    expect(this.obniz).send([{ ble: { scan: { duration: 30 } } }]);

    let results = [
      {
        ble: {
          scan_result: {
            address: 'e5f678800700',
            device_type: 'dumo',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -82,
            adv_data: [2, 1, 26],
            flag: 26,
            scan_resp: [],
          },
        },
      },
    ];

    testUtil.receiveJson(this.obniz, results);

    sinon.assert.callCount(stub, 1);
    let peripheral = stub.getCall(0).args[0];
    expect(typeof peripheral === 'object').to.be.true;

    expect(peripheral.adv_data).to.be.deep.equal([2, 1, 26]);
    expect(peripheral.localName).to.be.null;
    expect(peripheral.iBeacon).to.be.null;

    expect(this.obniz).to.be.finished;
  });

  it('on scan with target', function() {
    let stub = sinon.stub();

    this.obniz.ble.scan.onfind = stub;
    let target = {
      uuids: ['FFF0'], //scan only has uuids "FFF0" and "FFF1"
      localName: 'obniz-BLE', //scan only has localName "obniz-BLE"
    };

    let setting = {
      duration: 10,
    };

    this.obniz.ble.scan.start(target, setting);

    expect(this.obniz).send([{ ble: { scan: { duration: 10 } } }]);
    let results = [
      {
        ble: {
          scan_result: {
            address: '05e41890858c',
            device_type: 'ble',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -48,
            adv_data: [2, 1, 6, 7, 255, 76, 0, 16, 2, 11, 0],
            flag: 6,
            scan_resp: [],
          },
        },
      },
    ];

    testUtil.receiveJson(this.obniz, results);
    sinon.assert.callCount(stub, 0);

    let results2 = [
      {
        ble: {
          scan_result: {
            address: 'e5f678800700',
            device_type: 'ble',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -48,
            adv_data: [
              2,
              1,
              6,
              10,
              9,
              111,
              98,
              110,
              105,
              122,
              45,
              66,
              76,
              69,
              3,
              2,
              0xf0,
              0xff,
            ],
            flag: 6,
            scan_resp: [],
          },
        },
      },
    ];

    testUtil.receiveJson(this.obniz, results2);
    sinon.assert.callCount(stub, 1);

    let peripheral = stub.getCall(0).args[0];
    expect(typeof peripheral === 'object').to.be.true;

    expect(peripheral.adv_data).to.be.deep.equal([
      2, //flag
      1,
      6,
      10, //localName
      9,
      111,
      98,
      110,
      105,
      122,
      45,
      66,
      76,
      69,
      3, //uuid
      2,
      0xf0,
      0xff,
    ]);
    expect(peripheral.localName).to.be.equal('obniz-BLE');
    expect(peripheral.iBeacon).to.be.null;

    expect(this.obniz).to.be.finished;
  });

  it('on scan with target2', function() {
    let stub = sinon.stub();

    this.obniz.ble.scan.onfind = stub;
    let target = {
      uuids: ['713d0000-503e-4c75-ba94-3148f18d9400'], //scan only has uuids "FFF0" and "FFF1"
    };

    let setting = {
      duration: 10,
    };

    this.obniz.ble.scan.start(target, setting);

    expect(this.obniz).send([{ ble: { scan: { duration: 10 } } }]);
    let results = [
      {
        ble: {
          scan_result: {
            address: '05e41890858c',
            device_type: 'ble',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -48,
            adv_data: [2, 1, 6, 7, 255, 76, 0, 16, 2, 11, 0],
            flag: 6,
            scan_resp: [],
          },
        },
      },
    ];

    testUtil.receiveJson(this.obniz, results);
    sinon.assert.callCount(stub, 0);

    let results3 = [
      {
        ble: {
          scan_result: {
            address: '05e41890858d',
            device_type: 'ble',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -48,
            adv_data: [
              0x02,
              0x01,
              0x06,
              0x11,
              0x06,
              0x00,
              0x94,
              0x8d,
              0xf1,
              0x48,
              0x31,
              0x94,
              0xba,
              0x75,
              0x4c,
              0x3e,
              0x50,
              0x00,
              0x00,
              0x3d,
              0x72,
            ],
            flag: 6,
            scan_resp: [],
          },
        },
      },
    ];

    testUtil.receiveJson(this.obniz, results3);
    sinon.assert.callCount(stub, 0);

    let results2 = [
      {
        ble: {
          scan_result: {
            address: 'e5f678800700',
            device_type: 'ble',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -48,
            adv_data: [
              0x02,
              0x01,
              0x06,
              0x11,
              0x06,
              0x00,
              0x94,
              0x8d,
              0xf1,
              0x48,
              0x31,
              0x94,
              0xba,
              0x75,
              0x4c,
              0x3e,
              0x50,
              0x00,
              0x00,
              0x3d,
              0x71,
            ],
            flag: 6,
            scan_resp: [],
          },
        },
      },
    ];

    testUtil.receiveJson(this.obniz, results2);
    sinon.assert.callCount(stub, 1);

    let peripheral = stub.getCall(0).args[0];
    expect(typeof peripheral === 'object').to.be.true;

    expect(peripheral.adv_data).to.be.deep.equal([
      0x02,
      0x01,
      0x06,
      0x11,
      0x06,
      0x00,
      0x94,
      0x8d,
      0xf1,
      0x48,
      0x31,
      0x94,
      0xba,
      0x75,
      0x4c,
      0x3e,
      0x50,
      0x00,
      0x00,
      0x3d,
      0x71,
    ]);
    expect(peripheral.localName).to.be.null;
    expect(peripheral.iBeacon).to.be.null;

    expect(this.obniz).to.be.finished;
  });

  it('on scan finished', function() {
    let stub1 = sinon.stub();
    let stub2 = sinon.stub();

    this.obniz.ble.scan.onfind = stub1;
    this.obniz.ble.scan.onfinish = stub2;
    this.obniz.ble.scan.start();

    expect(this.obniz).send([{ ble: { scan: { duration: 30 } } }]);

    let results = [
      {
        ble: {
          scan_result_finish: true,
        },
      },
    ];

    testUtil.receiveJson(this.obniz, results);

    sinon.assert.callCount(stub1, 0);
    sinon.assert.callCount(stub2, 1);

    let peripherals = stub2.getCall(0).args[0];
    expect(peripherals).to.be.an('array');
    expect(peripherals.length).to.be.equal(0);

    expect(this.obniz).to.be.finished;
  });

  it('on scan finished2', function() {
    let stub1 = sinon.stub();
    let stub2 = sinon.stub();

    this.obniz.ble.scan.onfind = stub1;
    this.obniz.ble.scan.onfinish = stub2;
    this.obniz.ble.scan.start();

    expect(this.obniz).send([{ ble: { scan: { duration: 30 } } }]);

    let results1 = [
      {
        ble: {
          scan_result: {
            address: 'e5f678800700',
            device_type: 'dumo',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -82,
            adv_data: [2, 1, 26],
            flag: 26,
            scan_resp: [],
          },
        },
      },
    ];

    testUtil.receiveJson(this.obniz, results1);

    sinon.assert.callCount(stub1, 1);
    sinon.assert.callCount(stub2, 0);

    let results2 = [
      {
        ble: {
          scan_result_finish: true,
        },
      },
    ];

    testUtil.receiveJson(this.obniz, results2);

    sinon.assert.callCount(stub1, 1);
    sinon.assert.callCount(stub2, 1);

    let peripherals = stub2.getCall(0).args[0];
    expect(peripherals).to.be.an('array');
    expect(peripherals.length).to.be.equal(1);
    let peripheral = peripherals[0];
    expect(typeof peripheral === 'object').to.be.true;

    expect(peripheral.adv_data).to.be.deep.equal([2, 1, 26]);
    expect(peripheral.localName).to.be.null;
    expect(peripheral.iBeacon).to.be.null;

    expect(this.obniz).to.be.finished;
  });

  it('connect', function() {
    let stub = sinon.stub();

    this.obniz.ble.scan.onfind = stub;
    this.obniz.ble.scan.start();

    expect(this.obniz).send([{ ble: { scan: { duration: 30 } } }]);

    let results = [
      {
        ble: {
          scan_result: {
            address: 'e5f678800700',
            device_type: 'dumo',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -82,
            adv_data: [2, 1, 26],
            flag: 26,
            scan_resp: [],
          },
        },
      },
    ];

    testUtil.receiveJson(this.obniz, results);

    sinon.assert.callCount(stub, 1);
    let peripheral = stub.getCall(0).args[0];
    expect(typeof peripheral === 'object').to.be.true;

    let connectStub = sinon.stub();
    peripheral.onconnect = connectStub;
    peripheral.connect();

    expect(this.obniz).send([
      { ble: { connect: { address: 'e5f678800700' } } },
    ]);

    sinon.assert.callCount(connectStub, 0);

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          status_update: {
            address: 'e5f678800700',
            status: 'connected',
          },
        },
      },
    ]);

    sinon.assert.callCount(connectStub, 1);

    expect(this.obniz).to.be.finished;
  });

  it('disconnect', function() {
    let stub = sinon.stub();

    this.obniz.ble.scan.onfind = stub;
    this.obniz.ble.scan.start();

    expect(this.obniz).send([{ ble: { scan: { duration: 30 } } }]);

    let results = [
      {
        ble: {
          scan_result: {
            address: 'e5f678800700',
            device_type: 'dumo',
            address_type: 'public',
            ble_event_type: 'connectable_advertisemnt',
            rssi: -82,
            adv_data: [2, 1, 26],
            flag: 26,
            scan_resp: [],
          },
        },
      },
    ];

    testUtil.receiveJson(this.obniz, results);

    sinon.assert.callCount(stub, 1);
    let peripheral = stub.getCall(0).args[0];
    expect(typeof peripheral === 'object').to.be.true;

    let connectStub = sinon.stub();
    let disconnectStub = sinon.stub();
    peripheral.onconnect = connectStub;
    peripheral.ondisconnect = disconnectStub;
    peripheral.connect();

    expect(this.obniz).send([
      { ble: { connect: { address: 'e5f678800700' } } },
    ]);

    sinon.assert.callCount(connectStub, 0);

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          status_update: {
            address: 'e5f678800700',
            status: 'disconnected',
          },
        },
      },
    ]);

    sinon.assert.callCount(connectStub, 0);
    sinon.assert.callCount(disconnectStub, 1);

    expect(this.obniz).to.be.finished;
  });
});
