const config = require('../config.js');
const chai = require('chai');
const expect = chai.expect;
let obnizA;
let checkBoard;

describe.skip('9-ble-security', function () {
  this.timeout(30000);

  beforeEach(() => {
    console.error('reboot start');
    return new Promise((resolve) => {
      config.reboot(() => {
        obnizA = config.obnizA;
        checkBoard = config.checkBoard;
        console.error('reboot finished');
        setTimeout(resolve, 1000);
      }, false);
    });
  });
  it('dummy for reboot', async () => {});

  it('security', async () => {
    if (checkBoard.ble.hci) {
      return;
    }
    await checkBoard.ble.initWait();
    await obnizA.ble.initWait();
    checkBoard.ble.security.setModeLevel(1, 2);

    const SPDIService = new checkBoard.ble.service({
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

    checkBoard.ble.peripheral.addService(SPDIService);

    const advDataFromService = SPDIService.advData;
    advDataFromService.localName = 'OBNIZ';
    checkBoard.ble.advertisement.setAdvData(advDataFromService);
    checkBoard.ble.advertisement.start();
    // console.error('start adv');

    const peripheral = await obnizA.ble.scan.startOneWait({
      uuids: [SPDIService.uuid],
    });
    // console.log(peripheral);
    await peripheral.connectWait();
    await new Promise((r) => {
      setTimeout(r, 1000);
    });
    const data = await peripheral
      .getService('E625601E-9E55-4597-A598-76018A0D293D')
      .getCharacteristic('26E2B12B-85F0-4F3F-9FDD-91D114270E6E')
      .readWait();
    expect(data).to.be.deep.equal([56, 55, 56, 55, 57, 48, 52, 48]);
    checkBoard.ble.advertisement.end();
    checkBoard.ble.peripheral.end();
  });
});
