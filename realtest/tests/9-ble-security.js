const config = require('../config.js');
const chai = require('chai');
const expect = chai.expect;
let obnizA, obnizB;

describe('9-ble-security', function() {
  this.timeout(30000);

  beforeEach(function() {
    console.error('reboot start');
    return new Promise(resolve => {
      config.reboot(() => {
        obnizA = config.obnizA;
        obnizB = config.obnizB;
        console.error('reboot finished');
        setTimeout(resolve, 1000);
      }, false);
    });
  });
  it('dummy for reboot', async function() {});

  it('security', async function() {
    obnizA.ble.security.setModeLevel(1, 2);

    let SPDIService = new obnizA.ble.service({
      uuid: 'E625601E-9E55-4597-A598-76018A0D293D',
      characteristics: [
        {
          uuid: '26E2B12B-85F0-4F3F-9FDD-91D114270E6E',
          text: [56, 55, 56, 55, 57, 48, 52, 48],
          permissions: ['read_encrypted', 'write_encrypted'],
          descriptors: [
            {
              uuid: '2901',
              text: 'PSDI',
            },
          ],
        },
      ],
    });

    obnizA.ble.peripheral.addService(SPDIService);

    let advDataFromService = SPDIService.advData;
    advDataFromService.localName = 'OBNIZ';
    obnizA.ble.advertisement.setAdvData(advDataFromService);
    obnizA.ble.advertisement.start();
    console.error('start adv');

    let peripheral = await obnizB.ble.scan.startOneWait({
      uuids: [SPDIService.uuid],
    });
    console.log(peripheral);
    await peripheral.connectWait();

    let data = await peripheral
      .getService('E625601E-9E55-4597-A598-76018A0D293D')
      .getCharacteristic('26E2B12B-85F0-4F3F-9FDD-91D114270E6E')
      .readWait();
    expect(data).to.be.deep.equal([56, 55, 56, 55, 57, 48, 52, 48]);
    obnizA.ble.advertisement.end();
    obnizA.ble.peripheral.end();
  });
});
