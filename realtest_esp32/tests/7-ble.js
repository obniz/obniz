const config = require('../config.js');

let obnizA, esp32;

describe('7-ble', function() {
  this.timeout(30000);

  before(function() {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        obnizA = config.obnizA;
        esp32 = config.esp32;
        resolve();
      });
    });
  });

  it('simple ad', async function() {
    let service = new esp32.ble.service({
      uuid: '0000',
    });
    esp32.ble.peripheral.addService(service);
    let ad = service.advData;
    esp32.ble.advertisement.setAdvData(ad);
    esp32.ble.advertisement.start();

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
        found = true;
      }
    };
    obnizA.ble.scan.start(null, { duration: 30 });

    while (!found) {
      await wait(1);
    }

    esp32.ble.advertisement.end();
    esp32.ble.peripheral.end();
  });

  it('ad localname', async function() {
    let service = new esp32.ble.service({
      uuid: '0001',
    });
    esp32.ble.peripheral.addService(service);
    let ad = service.advData;
    const localName = '' + new Date().getTime();
    esp32.ble.advertisement.setScanRespData({
      localName: localName,
    });
    esp32.ble.advertisement.setAdvData(ad);
    esp32.ble.advertisement.start();

    let found = false;
    // let expectedValue = [2, 1, 6, 3, 2, 1, 0];
    obnizA.ble.scan.onfind = function(peripheral) {
      if (peripheral.localName === localName) {
        found = true;
      }
    };
    obnizA.ble.scan.start(null, { duration: 30 });

    while (!found) {
      await wait(1);
    }
    esp32.ble.advertisement.end();
    esp32.ble.peripheral.end();
  });
});

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
