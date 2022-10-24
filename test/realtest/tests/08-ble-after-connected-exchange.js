const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');
chai.use(require('chai-like'));

let obnizA;
let checkBoard;

describe('8-ble-exchange', function () {
  this.timeout(120000);

  before(async () => {
    await config.waitForConenct();
    obnizA = config.obnizA;
    checkBoard = config.checkBoard; // exchange A<->B
    await checkBoard.ble.initWait({ extended: false });
    await obnizA.ble.initWait({ extended: false });
    const service = new obnizA.ble.service({ uuid: 'FFF0' });
    const characteristic = new obnizA.ble.characteristic({
      uuid: 'FFF1',
      text: 'Hi',
    });
    const descriptor = new obnizA.ble.descriptor({
      uuid: '2901',
      text: 'hello wrold characteristic',
    });
    characteristic.addProperty('read');
    characteristic.addProperty('write');
    characteristic.addPermission('read');
    characteristic.addPermission('write');
    const characteristic2 = new obnizA.ble.characteristic({
      uuid: 'FFF2',
      data: [101, 51, 214],
    });
    characteristic2.addProperty('read');
    characteristic2.addPermission('read');

    const characteristic3 = new obnizA.ble.characteristic({
      uuid: 'FFF3',
      value: 92,
      descriptors: [
        {
          uuid: '2902',
          data: [0, 0],
          permissions: ['read', 'write'],
        },
      ],
    });
    characteristic3.addProperty('read');
    characteristic3.addProperty('write');
    characteristic3.addProperty('notify');

    const characteristic4 = new obnizA.ble.characteristic({
      uuid: 'FFF4',
      data: [0, 1, 2, 3, 4],
    });
    characteristic4.addProperty('write');

    service.addCharacteristic(characteristic);
    characteristic.addDescriptor(descriptor);
    service.addCharacteristic(characteristic2);
    service.addCharacteristic(characteristic3);
    service.addCharacteristic(characteristic4);

    obnizA.ble.peripheral.addService(service);
    const ad = service.advData;
    obnizA.ble.advertisement.setAdvData(ad);
    obnizA.ble.advertisement.start();
    // console.log('service created');
    await obnizA.pingWait();
    // console.log('scannning');
    const peripheral = await checkBoard.ble.scan.startOneWait({
      uuids: ['FFF0'],
    });
    if (!peripheral) {
      throw new Error('NOT FOUND');
    }
    // console.log('FOUND');

    expect(obnizA.ble.advertisement.adv_data).to.be.deep.equal(
      peripheral.adv_data
    );

    await peripheral.connectWait();

    await new Promise((r) => {
      setTimeout(r, 2000);
    });

    this.peripheral = peripheral;
    this.service = service;
  });

  it('discover', async () => {
    const services = await this.peripheral.discoverAllServicesWait();

    const results = [];
    for (const service of services) {
      const charas = await service.discoverAllCharacteristicsWait();

      for (const chara of charas) {
        if (chara.canRead()) {
          chara.data = await chara.readWait();
        }
        const descrs = await chara.discoverAllDescriptorsWait();
        for (const descr of descrs) {
          descr.data = await descr.readWait();
        }
      }
      results.push(JSON.parse(JSON.stringify(service)));
    }

    // remove device information (default added at ESP32)
    const filteredResults = results.filter(
      (e) => !['1801', '1800'].includes(e.uuid)
    );
    expect(filteredResults).like([
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
            descriptors: [
              {
                data: [0, 0],
                uuid: '2902',
              },
            ],
          },
          {
            properties: ['write'],
            uuid: 'fff4',
          },
        ],
        uuid: 'fff0',
      },
    ]);
  });

  it('create write', async () => {
    const chara = this.peripheral.getService('fff0').getCharacteristic('fff1');
    expect(chara.canWrite()).to.be.equal(true);
    expect(chara.canWriteWithoutResponse()).to.be.equal(false);
    expect(chara.canRead()).to.be.equal(true);
    expect(chara.canNotify()).to.be.equal(false);
    expect(chara.canIndicate()).to.be.equal(false);
    const result = await chara.writeTextWait('hello');
    expect(result).to.be.equal(true);
    const data = await chara.readWait();
    expect(data).to.be.deep.equal([104, 101, 108, 108, 111]);
  });

  it('create write error', async () => {
    const chara = this.peripheral.getService('fff0').getCharacteristic('fff2');
    expect(chara.canWrite()).to.be.equal(false);
    expect(chara.canWriteWithoutResponse()).to.be.equal(false);
    expect(chara.canRead()).to.be.equal(true);
    expect(chara.canNotify()).to.be.equal(false);
    expect(chara.canIndicate()).to.be.equal(false);
    // console.log('write');
    let isErrored = false;
    try {
      await chara.writeTextWait('hello');
    } catch (e) {
      isErrored = true;
    }
    expect(isErrored).to.be.equal(true);
    // console.log('read');
    const data = await chara.readWait();
    expect(data).to.be.deep.equal([101, 51, 214]);
    // console.log('finished');
  });
  //
  // it('read error', async () => {
  //   let chara = this.peripheral.getService('fff0').getCharacteristic('fff4');
  //   expect(chara.canWrite()).to.be.equal(true);
  //   expect(chara.canWriteWithoutResponse()).to.be.equal(false);
  //   expect(chara.canRead()).to.be.equal(false);
  //   expect(chara.canNotify()).to.be.equal(false);
  //   expect(chara.canIndicate()).to.be.equal(false);
  //
  //   let data = await chara.readWait();
  //   expect(data).to.be.deep.equal([0, 1, 2, 3, 4]);
  //   console.log('finished');
  // });

  it('nofify', async () => {
    // console.log('start!');
    let notifyed = false;
    const targetChara = this.peripheral
      .getService('FFF0')
      .getCharacteristic('FFF3');
    expect(targetChara.canWrite()).to.be.equal(true);
    expect(targetChara.canWriteWithoutResponse()).to.be.equal(false);
    expect(targetChara.canRead()).to.be.equal(true);
    expect(targetChara.canNotify()).to.be.equal(true);
    expect(targetChara.canIndicate()).to.be.equal(false);

    const p1 = new Promise((resolve) => {
      (async () => {
        await targetChara.registerNotifyWait((data) => {
          // console.log('notify!' + data.join(','));
          if (data.length === 1 && data[0] === 92) {
            notifyed = true;
          }
          resolve();
        });
        // console.log('registerNotify');
        await checkBoard.pingWait();
        await obnizA.pingWait();
        // console.log('start notify');
        this.service.getCharacteristic('FFF3').notify();
      })();
    });
    const p2 = new Promise((resolve) => {
      setTimeout(() => {
        // console.log('timeout!');
        resolve();
      }, 20000);
    });
    await Promise.race([p1, p2]);
    expect(notifyed).to.be.equal(true);
  });

  it('unknown service error', async () => {
    const service = this.peripheral.getService('FF00');
    expect(service).to.be.null;
  });

  it('unknown char error', async () => {
    const char = this.peripheral.getService('FFF0').getCharacteristic('FF00');
    expect(char).to.be.null;
  });

  it('unknown desc error', async () => {
    const desc = this.peripheral
      .getService('fff0')
      .getCharacteristic('fff1')
      .getDescriptor('2902');
    expect(desc).to.be.null;
  });

  it('close', async () => {
    const p = new Promise((resolve) => {
      obnizA.ble.peripheral.onconnectionupdates = (data) => {
        // console.log('onconnectionupdates ' + data);
        if (data.status === 'disconnected') {
          resolve();
        }
      };
    });
    await this.peripheral.disconnectWait();
    await p;
    // console.log('disconnected');
  });
});
