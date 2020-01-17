const config = require('../../realtest_esp32/config.js');

let obnizA, checkBoard;

describe('7-ble', function() {
  this.timeout(30000);

  before(async function() {
    await new Promise(resolve => {
      config.waitForConenct(() => {
        obnizA = config.obnizA;
        checkBoard = config.checkBoard;
        resolve();
      });
    });
    await checkBoard.ble.initWait();
    await obnizA.ble.initWait();
  });

  it('simple ad', async function() {
    let service = new checkBoard.ble.service({
      uuid: '0000',
    });
    checkBoard.ble.peripheral.addService(service);
    let ad = service.advData;
    checkBoard.ble.advertisement.setAdvData(ad);
    checkBoard.ble.advertisement.start();

    let found = false;
    let expectedValue = [2, 1, 6, 3, 2, 0, 0];
    obnizA.ble.scan.onfind = function(peripheral) {
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
    obnizA.ble.scan.start(null, { duration: 30 });

    while (!found) {
      await wait(1);
    }

    obnizA.ble.scan.end();
    checkBoard.ble.advertisement.end();
    checkBoard.ble.peripheral.end();
  });

  it('ad localname', async function() {
    let service = new checkBoard.ble.service({
      uuid: '0001',
    });
    checkBoard.ble.peripheral.addService(service);
    let ad = service.advData;
    const localName = '' + new Date().getTime();
    checkBoard.ble.advertisement.setScanRespData({
      localName: localName,
    });
    checkBoard.ble.advertisement.setAdvData(ad);
    checkBoard.ble.advertisement.start();

    let found = false;
    // let expectedValue = [2, 1, 6, 3, 2, 1, 0];
    obnizA.ble.scan.onfind = function(peripheral) {
      if (peripheral.localName === localName) {
        console.log(
          'FOUND! ' + peripheral.address + ' ' + peripheral.localName
        );
        found = true;
      }
    };
    obnizA.ble.scan.start(null, { duration: 30 });

    while (!found) {
      await wait(1);
    }
    obnizA.ble.scan.end();
    checkBoard.ble.advertisement.end();
    checkBoard.ble.peripheral.end();
  });
});

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
