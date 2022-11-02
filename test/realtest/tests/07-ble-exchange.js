const config = require('../config.js');

let obnizA;
let checkBoard;

describe('7-ble-exchange', function () {
  this.timeout(30000);

  before(async () => {
    await config.waitForConenct();
    obnizA = config.obnizA; // exchange A<->B
    checkBoard = config.checkBoard;
    await checkBoard.ble.initWait({ extended: false });
    await obnizA.ble.initWait({ extended: false });
  });

  it('simple ad', async () => {
    const service = new obnizA.ble.service({
      uuid: '0000',
    });
    obnizA.ble.peripheral.addService(service);
    const ad = service.advData;
    obnizA.ble.advertisement.setAdvData(ad);
    obnizA.ble.advertisement.start();

    let found = false;
    const expectedValue = [2, 1, 6, 3, 2, 0, 0];
    checkBoard.ble.scan.onfind = (peripheral) => {
      // console.log(peripheral.adv_data.length + ": " + peripheral.localName());
      if (peripheral.adv_data.length === expectedValue.length) {
        // console.log(peripheral.adv_data);
        for (let i = 0; i < expectedValue.length; i++) {
          if (peripheral.adv_data[i] !== expectedValue[i]) {
            return;
          }
        }
        console.log('FOUND! ' + peripheral.address);
        found = true;
      }
    };
    await checkBoard.ble.scan.startWait(null, { duration: 30 });

    while (!found) {
      await wait(1);
    }
    checkBoard.ble.scan.end();
    obnizA.ble.advertisement.end();
    obnizA.ble.peripheral.end();
  });

  it('ad localname', async () => {
    const service = new obnizA.ble.service({
      uuid: '0001',
    });
    obnizA.ble.peripheral.addService(service);
    const ad = service.advData;
    const localName = '' + new Date().getTime();
    obnizA.ble.advertisement.setScanRespData({
      localName,
    });
    obnizA.ble.advertisement.setAdvData(ad);
    obnizA.ble.advertisement.start();

    let found = false;
    // let expectedValue = [2, 1, 6, 3, 2, 1, 0];
    checkBoard.ble.scan.onfind = (peripheral) => {
      if (peripheral.localName === localName) {
        console.log(
          'FOUND! ' + peripheral.address + ' ' + peripheral.localName
        );
        found = true;
      }
    };
    console.log('scan sart at 07');
    await checkBoard.ble.scan.startWait(null, { duration: 30 });

    while (!found) {
      await wait(1);
    }
    checkBoard.ble.scan.end();
    obnizA.ble.advertisement.end();
    obnizA.ble.peripheral.end();
  });
});

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
