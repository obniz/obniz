const config = require('../config.js');

let obnizA, checkBoard;

describe('7-ble-exchange', function() {
  this.timeout(30000);

  before(async function() {
    await new Promise(resolve => {
      config.waitForConenct(() => {
        obnizA = config.obnizA; //exchange A<->B
        checkBoard = config.checkBoard;
        resolve();
      });
    });
    await obnizA.ble.initWait();
    await checkBoard.ble.initWait();
  });

  it('simple ad', async function() {
    let service = new obnizA.ble.service({
      uuid: '0000',
    });
    obnizA.ble.peripheral.addService(service);
    let ad = service.advData;
    obnizA.ble.advertisement.setAdvData(ad);
    obnizA.ble.advertisement.start();

    let found = false;
    let expectedValue = [2, 1, 6, 3, 2, 0, 0];
    checkBoard.ble.scan.onfind = function(peripheral) {
      // console.log(peripheral.adv_data.length + ": " + peripheral.localName());
      if (peripheral.adv_data.length === expectedValue.length) {
        // console.log(peripheral.adv_data);
        for (let i = 0; i < expectedValue.length; i++) {
          if (peripheral.adv_data[i] !== expectedValue[i]) {
            return;
          }
        }
        found = true;
      }
    };
    checkBoard.ble.scan.start(null, { duration: 30 });

    while (!found) {
      await wait(1);
    }

    obnizA.ble.advertisement.end();
    obnizA.ble.peripheral.end();
  });

  it('ad localname', async function() {
    let service = new obnizA.ble.service({
      uuid: '0001',
    });
    obnizA.ble.peripheral.addService(service);
    let ad = service.advData;
    const localName = '' + new Date().getTime();
    obnizA.ble.advertisement.setScanRespData({
      localName: localName,
    });
    obnizA.ble.advertisement.setAdvData(ad);
    obnizA.ble.advertisement.start();

    let found = false;
    // let expectedValue = [2, 1, 6, 3, 2, 1, 0];
    checkBoard.ble.scan.onfind = function(peripheral) {
      if (peripheral.localName === localName) {
        found = true;
      }
    };
    checkBoard.ble.scan.start(null, { duration: 30 });

    while (!found) {
      await wait(1);
    }
    obnizA.ble.advertisement.end();
    obnizA.ble.peripheral.end();
  });
});

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
