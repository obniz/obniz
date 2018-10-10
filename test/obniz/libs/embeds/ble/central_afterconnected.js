let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let testUtil = require('../../../..//testUtil.js');

chai.use(testUtil.obnizAssert);

describe('ble', function() {
  beforeEach(function() {
    testUtil.setupObnizPromise(this, function() {});
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
    this.peripheral = peripheral;
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('callback default function onconnect', function() {
    expect(this.peripheral.onconnect).to.have.not.throws();
  });
  it('callback default function ondisconnect', function() {
    expect(this.peripheral.ondisconnect).to.have.not.throws();
  });
  it('callback default function ondiscoverservice', function() {
    expect(this.peripheral.ondiscoverservice).to.have.not.throws();
  });

  it('callback default function ondiscoverservicefinish', function() {
    expect(this.peripheral.ondiscoverservicefinished).to.have.not.throws();
  });

  it('callback default function onerror', function() {
    expect(this.peripheral.onerror).to.have.not.throws();
  });

  it('rssi', function() {
    expect(this.peripheral.rssi).to.below(0);
  });

  it('to string', function() {
    let str = '' + this.peripheral;
    expect(str).to.be.equal(
      '{"address":"e5f678800700","addressType":"public","advertisement":[2,1,26],"scanResponse":[],"rssi":-82}'
    );
  });

  it('disconnect', function() {
    this.peripheral.disconnect();
    expect(this.obniz).send([
      {
        ble: {
          disconnect: {
            address: 'e5f678800700',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('discoverService', function() {
    let peripheral = this.peripheral;
    peripheral.discoverAllServices();
    expect(this.obniz).send([
      {
        ble: {
          get_services: {
            address: 'e5f678800700',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('discoverServiceResults', function() {
    let peripheral = this.peripheral;
    peripheral.ondiscoverservice = sinon.stub();
    peripheral.discoverAllServices();
    expect(this.obniz).send([
      {
        ble: {
          get_services: {
            address: 'e5f678800700',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;

    expect(peripheral.ondiscoverservice.callCount).to.be.equal(0);
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          get_service_result: {
            address: 'e5f678800700',
            service_uuid: 'FF00',
          },
        },
      },
    ]);

    expect(peripheral.ondiscoverservice.callCount).to.be.equal(1);
    expect(peripheral.ondiscoverservice.getCall(0).args.length).to.be.equal(1);

    let service = peripheral.ondiscoverservice.getCall(0).args[0];
    expect(service).to.be.a('object');
    expect(service.peripheral).to.be.equal(peripheral);
    expect(service.uuid).to.be.equal('ff00');
    expect(service).to.be.equal(peripheral.getService('FF00'));
  });

  it('discoverServiceResultsFinished', function() {
    let peripheral = this.peripheral;
    peripheral.ondiscoverservicefinished = sinon.stub();
    peripheral.discoverAllServices();
    expect(this.obniz).send([
      {
        ble: {
          get_services: {
            address: 'e5f678800700',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;

    expect(peripheral.ondiscoverservicefinished.callCount).to.be.equal(0);
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          get_service_result: {
            address: 'e5f678800700',
            service_uuid: 'FF00',
          },
        },
      },
    ]);

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          get_service_result: {
            address: 'e5f678800700',
            service_uuid: 'FF01',
          },
        },
      },
    ]);

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          get_service_result: {
            address: 'e5f678800701',
            service_uuid: 'FF01',
          },
        },
      },
    ]);

    expect(peripheral.ondiscoverservicefinished.callCount).to.be.equal(0);

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          get_service_result_finish: {
            address: 'e5f678800700',
          },
        },
      },
    ]);

    expect(peripheral.ondiscoverservicefinished.callCount).to.be.equal(1);
    expect(
      peripheral.ondiscoverservicefinished.getCall(0).args.length
    ).to.be.equal(1);

    let services = peripheral.ondiscoverservicefinished.getCall(0).args[0];
    expect(services.length).to.be.equal(2);
    expect(services[0]).to.be.a('object');
    expect(services[0].peripheral).to.be.equal(peripheral);
    expect(services[0].uuid).to.be.equal('ff00');
    expect(services[0]).to.be.equal(peripheral.getService('FF00'));
    expect(services[1]).to.be.a('object');
    expect(services[1].peripheral).to.be.equal(peripheral);
    expect(services[1].uuid).to.be.equal('ff01');
    expect(services[1]).to.be.equal(peripheral.getService('FF01'));
  });

  it('discoverServiceResults2', function() {
    let peripheral = this.peripheral;
    peripheral.ondiscoverservice = sinon.stub();
    peripheral.discoverAllServices();
    expect(this.obniz).send([
      {
        ble: {
          get_services: {
            address: 'e5f678800700',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;

    expect(peripheral.ondiscoverservice.callCount).to.be.equal(0);
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          get_service_result: {
            address: 'e5f678800701',
            service_uuid: 'FF00',
          },
        },
      },
    ]);

    expect(peripheral.ondiscoverservice.callCount).to.be.equal(0);
  });

  it('discoverCharacteristic', function() {
    let peripheral = this.peripheral;
    peripheral.getService('FF00').discoverAllCharacteristics();
    expect(this.obniz).send([
      {
        ble: {
          get_characteristics: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('discoverCharacteristicsResults', function() {
    let peripheral = this.peripheral;
    let service = peripheral.getService('FF00');
    service.ondiscovercharacteristic = sinon.stub();
    service.discoverAllCharacteristics();
    expect(this.obniz).send([
      {
        ble: {
          get_characteristics: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;

    expect(service.ondiscovercharacteristic.callCount).to.be.equal(0);
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          get_characteristic_result: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
            characteristic_uuid: 'ff01',
            properties: ['read', 'write'],
          },
        },
      },
    ]);

    expect(service.ondiscovercharacteristic.callCount).to.be.equal(1);
    expect(service.ondiscovercharacteristic.getCall(0).args.length).to.be.equal(
      1
    );

    let chara = service.ondiscovercharacteristic.getCall(0).args[0];
    expect(chara).to.be.a('object');
    expect(chara.service).to.be.equal(service);
    expect(chara.uuid).to.be.equal('ff01');
    expect(chara).to.be.equal(service.getCharacteristic('FF01'));
    expect(chara.canWrite()).to.be.true;
    expect(chara.canRead()).to.be.true;
    expect(chara.canNotify()).to.be.false;
    expect(chara.canIndicate()).to.be.false;
  });

  it('discoverCharacteristicsResults2', function() {
    let peripheral = this.peripheral;
    let service = peripheral.getService('FF00');
    service.ondiscovercharacteristic = sinon.stub();
    service.discoverAllCharacteristics();
    expect(this.obniz).send([
      {
        ble: {
          get_characteristics: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;

    expect(service.ondiscovercharacteristic.callCount).to.be.equal(0);
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          get_characteristic_result: {
            address: 'e5f678800700',
            service_uuid: 'FF01',
            characteristic_uuid: 'FF01',
            properties: ['read', 'write'],
          },
        },
      },
    ]);

    expect(service.ondiscovercharacteristic.callCount).to.be.equal(0);
  });

  it('discoverDescriptor', function() {
    let peripheral = this.peripheral;
    peripheral
      .getService('FF00')
      .getCharacteristic('FF01')
      .discoverAllDescriptors();
    expect(this.obniz).send([
      {
        ble: {
          get_descriptors: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
            characteristic_uuid: 'ff01',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('discoverDescriptorResults', function() {
    let peripheral = this.peripheral;
    let chara = peripheral.getService('FF00').getCharacteristic('FF01');
    chara.ondiscoverdescriptor = sinon.stub();
    chara.discoverAllDescriptors();
    expect(this.obniz).send([
      {
        ble: {
          get_descriptors: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
            characteristic_uuid: 'ff01',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;

    expect(chara.ondiscoverdescriptor.callCount).to.be.equal(0);
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          get_descriptor_result: {
            address: 'e5f678800700',
            service_uuid: 'FF00',
            characteristic_uuid: 'FF01',
            descriptor_uuid: '2901',
          },
        },
      },
    ]);

    expect(chara.ondiscoverdescriptor.callCount).to.be.equal(1);
    expect(chara.ondiscoverdescriptor.getCall(0).args.length).to.be.equal(1);

    let desc = chara.ondiscoverdescriptor.getCall(0).args[0];
    expect(desc).to.be.a('object');
    expect(desc.characteristic).to.be.equal(chara);
    expect(desc.uuid).to.be.equal('2901');
    expect(desc).to.be.equal(chara.getDescriptor('2901'));
  });

  it('discoverDescriptorResults2', function() {
    let peripheral = this.peripheral;
    let chara = peripheral.getService('FF00').getCharacteristic('FF01');
    chara.ondiscoverdescriptor = sinon.stub();
    chara.discoverAllDescriptors();
    expect(this.obniz).send([
      {
        ble: {
          get_descriptors: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
            characteristic_uuid: 'ff01',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;

    expect(chara.ondiscoverdescriptor.callCount).to.be.equal(0);
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          get_descriptor_result: {
            address: 'e5f678800700',
            service_uuid: 'FF00',
            characteristic_uuid: 'FF02',
            descriptor_uuid: '2901',
          },
        },
      },
    ]);

    expect(chara.ondiscoverdescriptor.callCount).to.be.equal(0);
  });

  it('write', function() {
    let peripheral = this.peripheral;
    peripheral
      .getService('FF00')
      .getCharacteristic('FF01')
      .write([0x01, 0xe8]);
    expect(this.obniz).send([
      {
        ble: {
          write_characteristic: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
            characteristic_uuid: 'ff01',
            data: [0x01, 0xe8],
            needResponse: true,
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('onwrite', function() {
    let peripheral = this.peripheral;

    let stub = sinon.stub();
    let chara = peripheral.getService('FF00').getCharacteristic('FF01');
    chara.write([0x01, 0xe8]);
    chara.onwrite = stub;
    expect(this.obniz).send([
      {
        ble: {
          write_characteristic: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
            characteristic_uuid: 'ff01',
            data: [0x01, 0xe8],
            needResponse: true,
          },
        },
      },
    ]);

    sinon.assert.callCount(stub, 0);

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          write_characteristic_result: {
            address: 'e5f678800700',
            service_uuid: 'ff00', //hex string
            characteristic_uuid: 'FF01', //hex string
            result: 'success', //success or failed
          },
        },
      },
    ]);
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args).to.be.lengthOf(1);

    expect(stub.getCall(0).args[0]).to.be.equal('success');
    expect(this.obniz).to.be.finished;
  });

  it('onwrite failed', function() {
    let peripheral = this.peripheral;

    let stub = sinon.stub();
    let chara = peripheral.getService('FF00').getCharacteristic('FF01');
    chara.onwrite = stub;
    chara.write([0x01, 0xe8]);
    expect(this.obniz).send([
      {
        ble: {
          write_characteristic: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
            characteristic_uuid: 'ff01',
            data: [0x01, 0xe8],
            needResponse: true,
          },
        },
      },
    ]);

    sinon.assert.callCount(stub, 0);

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          write_characteristic_result: {
            address: 'e5f678800700',
            service_uuid: 'FF00', //hex string
            characteristic_uuid: 'FF01', //hex string
            result: 'failed', //success or failed
          },
        },
      },
    ]);
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args).to.be.lengthOf(1);

    expect(stub.getCall(0).args[0]).to.be.equal('failed');
    expect(this.obniz).to.be.finished;
  });

  it('read', function() {
    let peripheral = this.peripheral;

    let stub = sinon.stub();
    let chara = peripheral.getService('FF00').getCharacteristic('FF01');
    chara.onread = stub;
    chara.read();
    expect(this.obniz).send([
      {
        ble: {
          read_characteristic: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
            characteristic_uuid: 'ff01',
          },
        },
      },
    ]);

    sinon.assert.callCount(stub, 0);

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          read_characteristic_result: {
            address: 'e5f678800700',
            service_uuid: 'FF00', //hex string
            characteristic_uuid: 'FF01', //hex string
            result: 'success',
            data: [0x2e, 0x22, 0x97], //success or failed
          },
        },
      },
    ]);

    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args).to.be.lengthOf(1);

    expect(stub.getCall(0).args[0]).to.be.deep.equal([0x2e, 0x22, 0x97]);

    expect(this.obniz).to.be.finished;
  });

  it('write descriptor', function() {
    let peripheral = this.peripheral;
    peripheral
      .getService('FF00')
      .getCharacteristic('FF01')
      .getDescriptor('2901')
      .write([0x01, 0xe8]);
    expect(this.obniz).send([
      {
        ble: {
          write_descriptor: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
            characteristic_uuid: 'ff01',
            descriptor_uuid: '2901',
            needResponse: true,
            data: [0x01, 0xe8],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('onwrite descriptor', function() {
    let peripheral = this.peripheral;

    let stub = sinon.stub();
    let descriptor = peripheral
      .getService('FF00')
      .getCharacteristic('FF01')
      .getDescriptor('2901');
    descriptor.write([0x01, 0xe8]);
    descriptor.onwrite = stub;
    expect(this.obniz).send([
      {
        ble: {
          write_descriptor: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
            characteristic_uuid: 'ff01',
            descriptor_uuid: '2901',
            data: [0x01, 0xe8],
            needResponse: true,
          },
        },
      },
    ]);

    sinon.assert.callCount(stub, 0);

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          write_descriptor_result: {
            address: 'e5f678800700',
            service_uuid: 'FF00', //hex string
            characteristic_uuid: 'FF01', //hex string
            descriptor_uuid: '2901',
            result: 'success', //success or failed
          },
        },
      },
    ]);
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args).to.be.lengthOf(1);

    expect(stub.getCall(0).args[0]).to.be.equal('success');
    expect(this.obniz).to.be.finished;
  });

  it('onwrite descriptor failed', function() {
    let peripheral = this.peripheral;

    let stub = sinon.stub();
    let descriptor = peripheral
      .getService('FF00')
      .getCharacteristic('FF01')
      .getDescriptor('2901');
    descriptor.onwrite = stub;
    descriptor.write([0x01, 0xe8]);
    expect(this.obniz).send([
      {
        ble: {
          write_descriptor: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
            characteristic_uuid: 'ff01',
            descriptor_uuid: '2901',
            data: [0x01, 0xe8],
            needResponse: true,
          },
        },
      },
    ]);

    sinon.assert.callCount(stub, 0);

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          write_descriptor_result: {
            address: 'e5f678800700',
            service_uuid: 'FF00', //hex string
            characteristic_uuid: 'FF01', //hex string
            descriptor_uuid: '2901',
            result: 'failed', //success or failed
          },
        },
      },
    ]);
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args).to.be.lengthOf(1);

    expect(stub.getCall(0).args[0]).to.be.equal('failed');
    expect(this.obniz).to.be.finished;
  });

  it('read descriptor', function() {
    let peripheral = this.peripheral;

    let stub = sinon.stub();
    let descriptor = peripheral
      .getService('FF00')
      .getCharacteristic('FF01')
      .getDescriptor('2901');
    descriptor.onread = stub;
    descriptor.read();
    expect(this.obniz).send([
      {
        ble: {
          read_descriptor: {
            address: 'e5f678800700',
            service_uuid: 'ff00',
            characteristic_uuid: 'ff01',
            descriptor_uuid: '2901',
          },
        },
      },
    ]);

    sinon.assert.callCount(stub, 0);

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          read_descriptor_result: {
            address: 'e5f678800700',
            service_uuid: 'FF00', //hex string
            characteristic_uuid: 'FF01', //hex string
            descriptor_uuid: '2901',
            data: [0x2e, 0x22, 0x97], //success or failed
          },
        },
      },
    ]);

    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args).to.be.lengthOf(1);

    expect(stub.getCall(0).args[0]).to.be.deep.equal([0x2e, 0x22, 0x97]);

    expect(this.obniz).to.be.finished;
  });

  it('error', function() {
    let stub = sinon.stub();
    let peripheral = this.peripheral;
    peripheral
      .getService('ff00')
      .getCharacteristic('ff01')
      .getDescriptor('ff01').onerror = stub;
    sinon.assert.callCount(stub, 0);

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          error: {
            error_code: 1,
            module_error_code: 1,
            function_code: 1,
            message: 'ERROR MESSAGE',
            address: 'e5f678800700', //hex string or null
            service_uuid: 'ff00', //hex string or null
            characteristic_uuid: 'FF01', //hex string or null
            descriptor_uuid: 'FF01', //hex string or null
          },
        },
      },
    ]);

    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args).to.be.lengthOf(1);
    expect(stub.getCall(0).args[0].message).to.be.equal('ERROR MESSAGE');

    expect(this.obniz).to.be.finished;
  });

  it('error2', function() {
    let stub = sinon.stub();
    let peripheral = this.peripheral;
    peripheral.getService('ff00').onerror = stub;
    sinon.assert.callCount(stub, 0);

    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          error: {
            error_code: 1,
            message: 'ERROR MESSAGE',
            address: 'e5f678800700', //hex string or null
            service_uuid: 'FF00', //hex string or null
          },
        },
      },
    ]);

    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args).to.be.lengthOf(1);
    expect(stub.getCall(0).args[0].message).to.be.equal('ERROR MESSAGE');

    expect(this.obniz).to.be.finished;
  });
});
