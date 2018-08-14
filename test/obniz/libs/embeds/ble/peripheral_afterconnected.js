let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let testUtil = require('../../../..//testUtil.js');
chai.use(testUtil.obnizAssert);

describe('ble', function() {
  beforeEach(function() {
    testUtil.setupObnizPromise(this, function() {});
    let service = new this.obniz.ble.service({ uuid: 'FFF0' });
    let characteristic = new this.obniz.ble.characteristic({
      uuid: 'FFF1',
      text: 'Hi',
    });
    let descriptor = new this.obniz.ble.descriptor({
      uuid: '2901',
      text: 'hello wrold characteristic',
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

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('onconnection updates', function() {
    this.obniz.ble.peripheral.onconnectionupdates = sinon.stub();

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          peripheral: {
            connection_status: {
              address: '77e754ab8591',
              status: 'connected',
            },
          },
        },
      },
    ]);
    sinon.assert.callCount(this.obniz.ble.peripheral.onconnectionupdates, 1);
    expect(
      this.obniz.ble.peripheral.onconnectionupdates.getCall(0).args.length
    ).to.be.equal(1);
    expect(
      this.obniz.ble.peripheral.onconnectionupdates.getCall(0).args[0]
    ).to.be.deep.equal({
      address: '77e754ab8591',
      status: 'connected',
    });
    expect(this.obniz).to.be.finished;
  });

  it('disconnected', function() {
    this.obniz.ble.peripheral.onconnectionupdates = sinon.stub();

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          peripheral: {
            connection_status: {
              address: '77e754ab8591',
              status: 'disconnected',
            },
          },
        },
      },
    ]);
    sinon.assert.callCount(this.obniz.ble.peripheral.onconnectionupdates, 1);
    expect(
      this.obniz.ble.peripheral.onconnectionupdates.getCall(0).args.length
    ).to.be.equal(1);
    expect(
      this.obniz.ble.peripheral.onconnectionupdates.getCall(0).args[0]
    ).to.be.deep.equal({
      address: '77e754ab8591',
      status: 'disconnected',
    });
    expect(this.obniz).to.be.finished;
  });

  it('end', function() {
    this.obniz.ble.peripheral.end();

    expect(this.obniz).send([
      {
        ble: {
          peripheral: null,
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('unknown service', function() {
    let service = this.obniz.ble.peripheral.getService('FFFF');
    expect(service).to.be.undefined;
  });

  it('unknown  characteristic', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('00F1');
    expect(chara).to.be.undefined;
  });

  it('unknown  descriptor', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    let desciptor = chara.getDescriptor('0000');
    expect(desciptor).to.be.undefined;
  });

  it('callback default function chara onread', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    expect(chara.onread).to.have.not.throws();
  });

  it('callback default function chara onwrite', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    expect(chara.onwrite).to.have.not.throws();
  });
  it('callback default function chara onwritefromremote', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    expect(chara.onwritefromremote).to.have.not.throws();
  });
  it('callback default function chara onreadfromremote', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    expect(chara.onreadfromremote).to.have.not.throws();
  });

  it('callback default function descriptor onread', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    let descriptor = chara.getDescriptor('2901');
    expect(descriptor.onread).to.have.not.throws();
  });

  it('callback default function descriptor onwrite', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    let descriptor = chara.getDescriptor('2901');
    expect(descriptor.onwrite).to.have.not.throws();
  });
  it('callback default function descriptor onwritefromremote', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    let descriptor = chara.getDescriptor('2901');
    expect(descriptor.onwritefromremote).to.have.not.throws();
  });
  it('callback default function descriptor onreadfromremote', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    let descriptor = chara.getDescriptor('2901');
    expect(descriptor.onreadfromremote).to.have.not.throws();
  });

  it('write char', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    chara.write([0x23, 0x83, 0x6e, 0xfc]);
    expect(this.obniz).send([
      {
        ble: {
          peripheral: {
            write_characteristic: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              data: [0x23, 0x83, 0x6e, 0xfc],
            },
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });
  it('write char2', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    chara.writeNumber(0x23);
    expect(this.obniz).send([
      {
        ble: {
          peripheral: {
            write_characteristic: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              data: [0x23],
            },
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('write results', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    chara.onwrite = sinon.stub();
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          peripheral: {
            write_characteristic_result: {
              service_uuid: 'FFF0',
              characteristic_uuid: 'FFF1',
              result: 'success',
            },
          },
        },
      },
    ]);

    expect(chara.onwrite.getCall(0).args.length).to.be.equal(1);
    expect(chara.onwrite.getCall(0).args[0]).to.be.deep.equal('success');
    expect(this.obniz).to.be.finished;
  });

  it('notify write results', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    chara.onwritefromremote = sinon.stub();
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          peripheral: {
            notify_write_characteristic: {
              address: '77e754ab8591',
              service_uuid: 'FFF0',
              characteristic_uuid: 'FFF1',
              data: [16, 34, 242],
            },
          },
        },
      },
    ]);

    expect(chara.onwritefromremote.getCall(0).args.length).to.be.equal(2);
    expect(chara.onwritefromremote.getCall(0).args[0]).to.be.deep.equal(
      '77e754ab8591'
    );
    expect(chara.onwritefromremote.getCall(0).args[1]).to.be.deep.equal([
      16,
      34,
      242,
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('read char', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    chara.read();
    expect(this.obniz).send([
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
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('read results', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    chara.onread = sinon.stub();
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          peripheral: {
            read_characteristic_result: {
              service_uuid: 'FFF0',
              characteristic_uuid: 'FFF1',
              data: [16, 34, 242],
              result: 'success',
            },
          },
        },
      },
    ]);

    expect(chara.onread.getCall(0).args.length).to.be.equal(1);
    expect(chara.onread.getCall(0).args[0]).to.be.deep.equal([16, 34, 242]);
    expect(this.obniz).to.be.finished;
  });

  it('notify read results', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    chara.onreadfromremote = sinon.stub();
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          peripheral: {
            notify_read_characteristic: {
              address: '77e754ab8591',
              service_uuid: 'FFF0',
              characteristic_uuid: 'FFF1',
            },
          },
        },
      },
    ]);

    expect(chara.onreadfromremote.getCall(0).args.length).to.be.equal(1);
    expect(chara.onreadfromremote.getCall(0).args[0]).to.be.deep.equal(
      '77e754ab8591'
    );
    expect(this.obniz).to.be.finished;
  });

  it('write descriptor', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    let desciptor = chara.getDescriptor('2901');
    desciptor.write([16, 34, 242]);
    expect(this.obniz).send([
      {
        ble: {
          peripheral: {
            write_descriptor: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              descriptor_uuid: '2901',
              data: [16, 34, 242],
            },
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('write descriptor2', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    let desciptor = chara.getDescriptor('2901');
    desciptor.writeNumber(16);
    expect(this.obniz).send([
      {
        ble: {
          peripheral: {
            write_descriptor: {
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              descriptor_uuid: '2901',
              data: [16],
            },
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('write descriptor results', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    let desciptor = chara.getDescriptor('2901');
    desciptor.onwrite = sinon.stub();
    testUtil.receiveJson(this.obniz, [
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
    ]);

    expect(desciptor.onwrite.getCall(0).args.length).to.be.equal(1);
    expect(desciptor.onwrite.getCall(0).args[0]).to.be.deep.equal('success');
    expect(this.obniz).to.be.finished;
  });

  it('notify descriptor write results', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    let desciptor = chara.getDescriptor('2901');
    desciptor.onwritefromremote = sinon.stub();
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          peripheral: {
            notify_write_descriptor: {
              address: '77e754ab8591',
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              descriptor_uuid: '2901',
              data: [16, 34, 242],
            },
          },
        },
      },
    ]);

    expect(desciptor.onwritefromremote.getCall(0).args.length).to.be.equal(2);
    expect(desciptor.onwritefromremote.getCall(0).args[0]).to.be.deep.equal(
      '77e754ab8591'
    );
    expect(desciptor.onwritefromremote.getCall(0).args[1]).to.be.deep.equal([
      16,
      34,
      242,
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('read descriptor', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    let desciptor = chara.getDescriptor('2901');
    desciptor.read();
    expect(this.obniz).send([
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
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('read descriptor results', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    let desciptor = chara.getDescriptor('2901');
    desciptor.onread = sinon.stub();
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          peripheral: {
            read_descriptor_result: {
              service_uuid: 'FFF0',
              characteristic_uuid: 'FFF1',
              descriptor_uuid: '2901',
              data: [16, 34, 242],
              result: 'success',
            },
          },
        },
      },
    ]);

    expect(desciptor.onread.getCall(0).args.length).to.be.equal(1);
    expect(desciptor.onread.getCall(0).args[0]).to.be.deep.equal([16, 34, 242]);
    expect(this.obniz).to.be.finished;
  });

  it('notify descriptor read results', function() {
    let service = this.obniz.ble.peripheral.getService('FFF0');
    let chara = service.getCharacteristic('FFF1');
    let desciptor = chara.getDescriptor('2901');
    desciptor.onreadfromremote = sinon.stub();
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          peripheral: {
            notify_read_descriptor: {
              address: '77e754ab8591',
              service_uuid: 'fff0',
              characteristic_uuid: 'fff1',
              descriptor_uuid: '2901',
            },
          },
        },
      },
    ]);

    expect(desciptor.onreadfromremote.getCall(0).args.length).to.be.equal(1);
    expect(desciptor.onreadfromremote.getCall(0).args[0]).to.be.deep.equal(
      '77e754ab8591'
    );
    expect(this.obniz).to.be.finished;
  });
});
