const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let obnizA, obnizB;

describe('8-ble', function() {
  this.timeout(120000);

  before(async () => {
    await new Promise(resolve => {
      config.waitForConenct(() => {
        obnizA = config.obnizA;
        obnizB = config.obnizB;
        resolve();
      });
    });
    let service = new obnizA.ble.service({ uuid: 'FFF0' });
    let characteristic = new obnizA.ble.characteristic({
      uuid: 'FFF1',
      text: 'Hi',
    });
    let descriptor = new obnizA.ble.descriptor({
      uuid: '2901',
      text: 'hello wrold characteristic',
    });
    characteristic.addProperty('read');
    characteristic.addProperty('write');
    characteristic.addPermission('read');
    characteristic.addPermission('write');
    let characteristic2 = new obnizA.ble.characteristic({
      uuid: 'FFF2',
      data: [101, 51, 214],
    });
    characteristic2.addProperty('read');
    characteristic2.addPermission('read');

    let characteristic3 = new obnizA.ble.characteristic({
      uuid: 'FFF3',
      value: 92,
    });
    characteristic3.addProperty('read');
    characteristic3.addProperty('write');
    characteristic3.addProperty('notify');

    service.addCharacteristic(characteristic);
    characteristic.addDescriptor(descriptor);
    service.addCharacteristic(characteristic2);
    service.addCharacteristic(characteristic3);

    obnizA.ble.peripheral.addService(service);
    let ad = service.advData;
    obnizA.ble.advertisement.setAdvData(ad);
    obnizA.ble.advertisement.start();
    //console.log('service created');
    await obnizA.pingWait();
    //console.log('scannning');
    let peripheral = await obnizB.ble.scan.startOneWait({ uuids: ['FFF0'] });
    if (!peripheral) {
      throw new Error('NOT FOUND');
    }
    //console.log('FOUND');

    expect(obnizA.ble.advertisement.adv_data).to.be.deep.equal(
      peripheral.adv_data
    );

    let connected = await peripheral.connectWait();
    if (!connected) {
      throw new Error('DISCONNECTED');
    }
    //console.log('CONNECTED');

    this.peripheral = peripheral;
    this.service = service;
  });

  it('discover', async () => {
    let services = await this.peripheral.discoverAllServicesWait();

    let results = [];
    for (let service of services) {
      let charas = await service.discoverAllCharacteristicsWait();

      for (let chara of charas) {
        chara.data = await chara.readWait();

        let descrs = await chara.discoverAllDescriptorsWait();
        for (let descr of descrs) {
          descr.data = await descr.readWait();
        }
      }
      results.push(JSON.parse(JSON.stringify(service)));
    }

    expect(results).to.be.deep.equal([
      {
        characteristics: [
          {
            properties: ['indicate'],
            uuid: '2a05',
          },
        ],
        uuid: '1801',
      },
      {
        characteristics: [
          {
            data: [],
            properties: ['read'],
            uuid: '2a00',
          },
          {
            data: [0, 0],
            properties: ['read'],
            uuid: '2a01',
          },
          {
            data: [0],
            properties: ['read'],
            uuid: '2aa6',
          },
        ],
        uuid: '1800',
      },
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
            properties: ['read', 'write'],
            uuid: 'fff1',
          },
          {
            properties: ['read'],
            data: [101, 51, 214],
            uuid: 'fff2',
          },
          {
            properties: ['read', 'write', 'notify'],
            data: [92],
            uuid: 'fff3',
          },
        ],
        uuid: 'fff0',
      },
    ]);
  });

  it('create write', async () => {
    let chara = this.peripheral.getService('fff0').getCharacteristic('fff1');
    expect(chara.canWrite()).to.be.equal(true);
    expect(chara.canWriteWithoutResponse()).to.be.equal(false);
    expect(chara.canRead()).to.be.equal(true);
    expect(chara.canNotify()).to.be.equal(false);
    expect(chara.canIndicate()).to.be.equal(false);
    let result = await chara.writeTextWait('hello');
    expect(result).to.be.equal(true);
    let data = await chara.readWait();
    expect(data).to.be.deep.equal([104, 101, 108, 108, 111]);
  });

  it('create write error', async () => {
    let chara = this.peripheral.getService('fff0').getCharacteristic('fff2');
    expect(chara.canWrite()).to.be.equal(false);
    expect(chara.canWriteWithoutResponse()).to.be.equal(false);
    expect(chara.canRead()).to.be.equal(true);
    expect(chara.canNotify()).to.be.equal(false);
    expect(chara.canIndicate()).to.be.equal(false);
    let result = await chara.writeTextWait('hello');
    expect(result).to.be.equal(false);
    let data = await chara.readWait();
    expect(data).to.be.deep.equal([101, 51, 214]);
  });

  it('nofify', async () => {
    console.log('start!');
    let notifyed = false;
    let targetChara = this.peripheral
      .getService('FFF0')
      .getCharacteristic('FFF3');
    expect(targetChara.canWrite()).to.be.equal(true);
    expect(targetChara.canWriteWithoutResponse()).to.be.equal(false);
    expect(targetChara.canRead()).to.be.equal(true);
    expect(targetChara.canNotify()).to.be.equal(true);
    expect(targetChara.canIndicate()).to.be.equal(false);

    let p1 = new Promise(function(resolve) {
      targetChara.registerNotify(function() {
        console.log('notify!');
        notifyed = true;
        resolve();
      });
    });
    await obnizB.pingWait();
    this.service.getCharacteristic('FFF3').notify();
    await obnizA.pingWait();
    let p2 = new Promise(function(resolve) {
      setTimeout(function() {
        console.log('timeout!');
        resolve();
      }, 10000);
    });
    await Promise.race([p1, p2]);
    expect(notifyed).to.be.equal(true);
  });

  it('unknown service error', async () => {
    let results = await this.peripheral
      .getService('FF00')
      .getCharacteristic('FF00')
      .writeWait([10]);
    await obnizA.pingWait();
    expect(results).to.be.false;
  });
  it('unknown char error read', async () => {
    let val = await this.peripheral
      .getService('FFF0')
      .getCharacteristic('FF00')
      .readWait();
    await obnizA.pingWait();
    expect(val).to.be.undefined;
  });

  it('unknown char error', async () => {
    let results = await this.peripheral
      .getService('FFF0')
      .getCharacteristic('FF00')
      .writeWait([10]);
    await obnizA.pingWait();
    expect(results).to.be.false;
  });

  it('unknown desc error', async () => {
    let results = await this.peripheral
      .getService('fff0')
      .getCharacteristic('fff1')
      .getDescriptor('2902')
      .writeWait([10]);
    await obnizA.pingWait();
    expect(results).to.be.false;
  });

  it('unknown desc error read', async () => {
    let results = await this.peripheral
      .getService('fff0')
      .getCharacteristic('fff1')
      .getDescriptor('2902')
      .readWait();
    await obnizA.pingWait();
    expect(results).to.be.undefined;
  });
});
