const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');

module.exports = async function(config) {

  const obnizA = config.obnizA;
  const obnizB = config.obnizB;

  describe(path.basename(__filename), function () {

    this.timeout(30000);

    it("simple ad", async function () {
      var service = new obnizA.ble.service({
        uuid : "0000"
      });
      obnizA.ble.peripheral.addService(service); 
      var ad = service.advData;
      obnizA.ble.setAdvData(ad);
      obnizA.ble.startAdvertisement();

      var found = false;
      var expectedValue = [2,1,6,3,2,0,0];
      obnizB.ble.onscan = function(peripheral){
        // console.log(peripheral.adv_data.length + ": " + peripheral.localName());
        if (peripheral.adv_data.length === expectedValue.length) {
          // console.log(peripheral.adv_data);
          for (var i=0; i<expectedValue.length; i++) {
            if (peripheral.adv_data[i] !== expectedValue[i]) {
              return;
            }
          }
          found = true;
        }
      }
      obnizB.ble.startScan({duration : 30});
      
      while(!found){
        await wait(1);
      }

      obnizA.ble.stopAdvertisement();
      obnizA.ble.peripheral.end();
    });

    it("ad localname", async function () {
      var service = new obnizA.ble.service({
        uuid : "0000"
      });
      obnizA.ble.peripheral.addService(service); 
      var ad = service.advData;
      const localName = "" + (new Date()).getTime();
      obnizA.ble.setScanRespData({
        localName : localName
      });
      obnizA.ble.setAdvData(ad);
      obnizA.ble.startAdvertisement();

      var found = false;
      var expectedValue = [2,1,6,3,2,0,0];
      obnizB.ble.onscan = function(peripheral){
        if (peripheral.localName() === localName) {
          found = true;
        }
      }
      obnizB.ble.startScan({duration : 30});
      
      while(!found){
        await wait(1);
      }
      obnizA.ble.stopAdvertisement();
      obnizA.ble.peripheral.end();
    });
  });

  function wait(ms) {
    return new Promise(resolve => {setTimeout(resolve, ms)})
  }
}