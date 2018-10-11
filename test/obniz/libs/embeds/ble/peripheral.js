let chai = require('chai');
let expect = chai.expect;

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

  it('start', function() {
    this.obniz.ble.advertisement.start();

    expect(this.obniz).send([{ ble: { advertisement: { adv_data: [] } } }]);
    expect(this.obniz).to.be.finished;
  });

  it('stop', function() {
    this.obniz.ble.advertisement.end();

    expect(this.obniz).send([{ ble: { advertisement: null } }]);
    expect(this.obniz).to.be.finished;
  });

  it('service generate ad', function() {
    let service = new this.obniz.ble.service({
      uuid: 'FFF0',
    });
    expect(service.advData).to.deep.equal({
      flags: ['general_discoverable_mode', 'br_edr_not_supported'],
      serviceUuids: ['fff0'],
    });
    expect(this.obniz).to.be.finished;
  });

  it('set adv raw', function() {
    this.obniz.ble.advertisement.setAdvDataRaw([
      0x02,
      0x01,
      0x1a,
      0x07,
      0x09,
      0x53,
      0x61,
      0x6d,
      0x70,
      0x6c,
      0x65,
    ]);
    this.obniz.ble.advertisement.start();
    expect(this.obniz).send([
      {
        ble: {
          advertisement: {
            adv_data: [
              0x02,
              0x01,
              0x1a,
              0x07,
              0x09,
              0x53,
              0x61,
              0x6d,
              0x70,
              0x6c,
              0x65,
            ],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('set adv', function() {
    this.obniz.ble.advertisement.setAdvData({
      flags: ['general_discoverable_mode', 'br_edr_not_supported'],
      manufacturerData: {
        companyCode: 0x004c,
        data: [
          0x02,
          0x15,
          0xc2,
          0x8f,
          0x0a,
          0xd5,
          0xa7,
          0xfd,
          0x48,
          0xbe,
          0x9f,
          0xd0,
          0xea,
          0xe9,
          0xff,
          0xd3,
          0xa8,
          0xbb,
          0x10,
          0x00,
          0x00,
          0x10,
          0xff,
        ],
      },
    });
    this.obniz.ble.advertisement.start();

    expect(this.obniz).send([
      {
        ble: {
          advertisement: {
            adv_data: [
              0x02,
              0x01,
              0x06,
              0x1a,
              0xff,
              0x4c,
              0x00,
              0x02,
              0x15,
              0xc2,
              0x8f,
              0x0a,
              0xd5,
              0xa7,
              0xfd,
              0x48,
              0xbe,
              0x9f,
              0xd0,
              0xea,
              0xe9,
              0xff,
              0xd3,
              0xa8,
              0xbb,
              0x10,
              0x00,
              0x00,
              0x10,
              0xff,
            ],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('set scan resp raw', function() {
    this.obniz.ble.advertisement.setScanRespDataRaw([
      0x07,
      0x09,
      0x53,
      0x61,
      0x6d,
      0x70,
      0x6c,
      0x65,
    ]);
    this.obniz.ble.advertisement.start();

    expect(this.obniz).send([
      {
        ble: {
          advertisement: {
            adv_data: [],
            scan_resp: [0x07, 0x09, 0x53, 0x61, 0x6d, 0x70, 0x6c, 0x65],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('set scan resp', function() {
    this.obniz.ble.advertisement.setScanRespData({
      localName: 'obniz BLE',
    });
    this.obniz.ble.advertisement.start();

    expect(this.obniz).send([
      {
        ble: {
          advertisement: {
            adv_data: [],
            scan_resp: [
              0x0a,
              0x09,
              0x6f,
              0x62,
              0x6e,
              0x69,
              0x7a,
              0x20,
              0x42,
              0x4c,
              0x45,
            ],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('start service', function() {
    let setting = {
      uuid: 'FFF0',
      characteristics: [
        {
          uuid: 'FFF1',
          data: [0x0e, 0x00], //data for dataArray or  text for string
          descriptors: [
            {
              uuid: '2901', //Characteristic User Description
              text: 'hello world characteristic', //data for dataArray or  text for string
            },
          ],
        },
      ],
    };
    this.obniz.ble.peripheral.addService(setting);

    expect(this.obniz).send([
      {
        ble: {
          peripheral: {
            services: [
              {
                characteristics: [
                  {
                    data: [14, 0],
                    descriptors: [
                      {
                        data: [
                          104,
                          101,
                          108,
                          108,
                          111,
                          32,
                          119,
                          111,
                          114,
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
                        uuid: '2901',
                      },
                    ],
                    uuid: 'fff1',
                  },
                ],
                uuid: 'fff0',
              },
            ],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('start service from object', function() {
    let service = new this.obniz.ble.service({ uuid: 'FFF0' });
    let characteristic = new this.obniz.ble.characteristic({
      uuid: 'FFF1',
      text: 'Hi',
    });
    let descriptor = new this.obniz.ble.descriptor({
      uuid: '2901',
      text: 'hello world characteristic',
    });

    service.addCharacteristic(characteristic);
    characteristic.addDescriptor(descriptor);

    this.obniz.ble.peripheral.addService(service);
    expect(this.obniz).send([
      {
        ble: {
          peripheral: {
            services: [
              {
                characteristics: [
                  {
                    data: [72, 105],
                    descriptors: [
                      {
                        data: [
                          104,
                          101,
                          108,
                          108,
                          111,
                          32,
                          119,
                          111,
                          114,
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
                        uuid: '2901',
                      },
                    ],
                    uuid: 'fff1',
                  },
                ],
                uuid: 'fff0',
              },
            ],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('start service from json', function() {
    let setting = {
      services: [
        {
          uuid: 'FFF0',
          characteristics: [
            {
              uuid: 'FFF1',
              data: [72, 105], //data for dataArray or  text for string
              descriptors: [
                {
                  uuid: '2901', //Characteristic User Description
                  text: 'hello world characteristic', //data for dataArray or  text for string
                },
              ],
            },
          ],
        },
      ],
    };
    this.obniz.ble.peripheral.setJson(setting);

    expect(this.obniz).send([
      {
        ble: {
          peripheral: {
            services: [
              {
                characteristics: [
                  {
                    data: [72, 105],
                    descriptors: [
                      {
                        data: [
                          104,
                          101,
                          108,
                          108,
                          111,
                          32,
                          119,
                          111,
                          114,
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
                        uuid: '2901',
                      },
                    ],
                    uuid: 'fff1',
                  },
                ],
                uuid: 'fff0',
              },
            ],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('check json', function() {
    let service = new this.obniz.ble.service({ uuid: 'FFF0' });
    let characteristic = new this.obniz.ble.characteristic({
      uuid: 'FFF1',
      text: 'Hi',
    });
    let descriptor = new this.obniz.ble.descriptor({
      uuid: '2901',
      text: 'hello world characteristic',
    });

    service.addCharacteristic(characteristic);
    characteristic.addDescriptor(descriptor);

    this.obniz.ble.peripheral.addService(service);

    expect(this.obniz).send([
      {
        ble: {
          peripheral: {
            services: [
              {
                characteristics: [
                  {
                    descriptors: [
                      {
                        data: [
                          104,
                          101,
                          108,
                          108,
                          111,
                          32,
                          119,
                          111,
                          114,
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
                        uuid: '2901',
                      },
                    ],
                    data: [72, 105],
                    uuid: 'fff1',
                  },
                ],
                uuid: 'fff0',
              },
            ],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;

    let serviceJson = JSON.stringify(this.obniz.ble.peripheral);
    expect(serviceJson).to.be.deep.equal(
      JSON.stringify({
        services: [
          {
            uuid: 'fff0',
            characteristics: [
              {
                uuid: 'fff1',
                descriptors: [
                  {
                    uuid: '2901',
                    data: [
                      104,
                      101,
                      108,
                      108,
                      111,
                      32,
                      119,
                      111,
                      114,
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
                ],
                data: [72, 105],
              },
            ],
          },
        ],
      })
    );
  });

  it('read char', function() {
    let service = new this.obniz.ble.service({ uuid: '1234' });
    let characteristic = new this.obniz.ble.characteristic({
      uuid: '7777',
      data: [1, 2, 3],
    });
    service.addCharacteristic(characteristic);
    this.obniz.ble.peripheral.addService(service);

    expect(this.obniz).send([
      {
        ble: {
          peripheral: {
            services: [
              {
                characteristics: [
                  {
                    data: [1, 2, 3],
                    uuid: '7777',
                  },
                ],
                uuid: '1234',
              },
            ],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;

    return new Promise(resolve => {
      characteristic.readWait().then(data => {
        expect(data).to.deep.equal([1, 2, 3]);
        resolve();
      });
      expect(this.obniz).send([
        {
          ble: {
            peripheral: {
              read_characteristic: {
                service_uuid: '1234',
                characteristic_uuid: '7777',
              },
            },
          },
        },
      ]);

      expect(this.obniz).to.be.finished;

      testUtil.receiveJson(this.obniz, [
        {
          ble: {
            peripheral: {
              read_characteristic_result: {
                service_uuid: '1234',
                characteristic_uuid: '7777',
                data: [1, 2, 3],
                result: 'success',
              },
            },
          },
        },
      ]);
    });
  });

  it('read descriptor', function() {
    this.obniz.debugpring = true;
    let service = new this.obniz.ble.service({ uuid: '1234' });
    let characteristic = new this.obniz.ble.characteristic({
      uuid: '7777',
      data: [1, 2, 3],
    });
    let descriptor = new this.obniz.ble.descriptor({
      uuid: '2901', //Characteristic User Description
      text: 'sample',
    });
    service.addCharacteristic(characteristic);
    characteristic.addDescriptor(descriptor);

    this.obniz.ble.peripheral.addService(service);

    expect(this.obniz).send([
      {
        ble: {
          peripheral: {
            services: [
              {
                characteristics: [
                  {
                    data: [1, 2, 3],
                    descriptors: [
                      {
                        data: [115, 97, 109, 112, 108, 101],
                        uuid: '2901',
                      },
                    ],
                    uuid: '7777',
                  },
                ],
                uuid: '1234',
              },
            ],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;

    return new Promise(resolve => {
      descriptor.readWait().then(data => {
        expect(data).to.deep.equal([115, 97, 109, 112, 108, 101]);
        resolve();
      });
      expect(this.obniz).send([
        {
          ble: {
            peripheral: {
              read_descriptor: {
                characteristic_uuid: '7777',
                descriptor_uuid: '2901',
                service_uuid: '1234',
              },
            },
          },
        },
      ]);

      expect(this.obniz).to.be.finished;

      testUtil.receiveJson(this.obniz, [
        {
          ble: {
            peripheral: {
              read_descriptor_result: {
                service_uuid: '1234',
                characteristic_uuid: '7777',
                descriptor_uuid: '2901',
                data: [115, 97, 109, 112, 108, 101],
                result: 'success',
              },
            },
          },
        },
      ]);
    });
  });
});
