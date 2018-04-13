const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');
const config = require('../config.js');

let obnizA, obnizB ;

describe("7-ble", function () {

  this.timeout(40000);

  before(function () {
    return new Promise((resolve) => {
      config.waitForConenct(() => {
        obnizA = config.obnizA;
        obnizB = config.obnizB;
        resolve();
      })
    });
  });


  it("simple ad", async function () {
    let service = new obnizA.ble.service({
      uuid: "0000"
    });
    obnizA.ble.peripheral.addService(service);
    let ad = service.advData;
    obnizA.ble.setAdvData(ad);
    obnizA.ble.startAdvertisement();

    let found = false;
    let expectedValue = [2, 1, 6, 3, 2, 0, 0];
    obnizB.ble.onscan = function (peripheral) {
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
    }
    obnizB.ble.startScan(null,{duration: 30});

    while (!found) {
      await wait(1);
    }

    obnizA.ble.stopAdvertisement();
    obnizA.ble.peripheral.end();
  });

  it("ad localname", async function () {
    let service = new obnizA.ble.service({
      uuid: "0000"
    });
    obnizA.ble.peripheral.addService(service);
    let ad = service.advData;
    const localName = "" + (new Date()).getTime();
    obnizA.ble.setScanRespData({
      localName: localName
    });
    obnizA.ble.setAdvData(ad);
    obnizA.ble.startAdvertisement();

    let found = false;
    let expectedValue = [2, 1, 6, 3, 2, 0, 0];
    obnizB.ble.onscan = function (peripheral) {
      if (peripheral.localName() === localName) {
        found = true;
      }
    };
    obnizB.ble.startScan(null, {duration: 30});

    while (!found) {
      await wait(1);
    }
    obnizA.ble.stopAdvertisement();
    obnizA.ble.peripheral.end();
  });


  it("create service",async ()=>{

    // obnizA.debugprint = true;
    // obnizB.debugprint = true;

    var service = new obnizA.ble.service({"uuid" : "FFF0"});
    var characteristic = new obnizA.ble.characteristic({"uuid" : "FFF1", "text": "Hi"});
    var descriptor = new obnizA.ble.descriptor({"uuid" : "2901", "text" : "hello wrold characteristic"});

    service.addCharacteristic(characteristic);
    characteristic.addDescriptor(descriptor);

    obnizA.ble.peripheral.addService(service);   // addServiceはaddCharacteristic,addDescriptorよりもあとに来る必要があります

    let ad = service.advData;
    obnizA.ble.setAdvData(ad);
    obnizA.ble.startAdvertisement();
    console.log("service created");

    await obnizA.pingWait();
    console.log("start scan");


    let peripheral = await obnizB.ble.startScanWait({uuids:["FFF0"]});
    if(!peripheral){
      throw new Error("NOT FOUND");
    }
    console.log("FOUND");

    expect(obnizA.ble.adv_data).to.be.deep.equal(peripheral.adv_data);

    let connected = await peripheral.connectWait();
    if(!connected){
      throw new Error("DISCONNECTED");
    }
    console.log("CONNECTED");

    let services = await peripheral.discoverAllServicesWait();

    let results = [];
    for(let service of services){
      if(service.uuid !== "fff0"){continue}
      let charas = await service.discoverAllCharacteristicsWait();

      expect(charas.length).to.be.equal(1);
      expect(charas[0].uuid).to.be.equal("fff1");

      for(let chara of charas){
        console.log(`service ${service.uuid} chara ${chara.uuid}  [${chara.properties}] `);


        expect(chara.canRead()).to.be.equal(true);
        let val = await chara.readWait();
        console.log(`service ${service.uuid} chara ${chara.uuid} value ${val}`);
        expect(val).to.be.deep.equal([72,105]);

        let descrs = await chara.discoverAllDescriptorsWait();
        expect(descrs.length).to.be.equal(1);
        expect(descrs[0].uuid).to.be.equal("2901");
        for(let descr of descrs){
          console.log(`service ${service.uuid} chara ${chara.uuid} descr ${descr.uuid}`);
          let val = await descr.readWait();
          expect(val).to.be.deep.equal([104,101,108,108,111,32,119,114,111,108,100,32,99,104,97,114,97,99,116,101,114,105,115,116,105,99]);
          console.log(`service ${service.uuid} chara ${chara.uuid} descr ${descr.uuid} value ${val}`);
        }
      }
    }


  })



  it("char permission",async ()=>{

    obnizA.debugprint = true;
    obnizA.debugprintBinary = true;
    // obnizB.debugprint = true;

    var service = new obnizA.ble.service({"uuid" : "FFF0"});
    var characteristic = new obnizA.ble.characteristic({"uuid" : "FFF1", "text": "Hi"});
    characteristic.addProperty("write");
    var descriptor = new obnizA.ble.descriptor({"uuid" : "2901", "text" : "hello wrold characteristic"});

    service.addCharacteristic(characteristic);
    characteristic.addDescriptor(descriptor);

    obnizA.ble.peripheral.addService(service);   // addServiceはaddCharacteristic,addDescriptorよりもあとに来る必要があります

    let ad = service.advData;
    obnizA.ble.setAdvData(ad);
    obnizA.ble.startAdvertisement();
    console.log("service created");

    await obnizA.pingWait();
    console.log("start scan");


    let peripheral = await obnizB.ble.startScanWait({uuids:["FFF0"]});
    if(!peripheral){
      throw new Error("NOT FOUND");
    }
    console.log("FOUND");

    expect(obnizA.ble.adv_data).to.be.deep.equal(peripheral.adv_data);

    let connected = await peripheral.connectWait();
    if(!connected){
      throw new Error("DISCONNECTED");
    }
    console.log("CONNECTED");

    let services = await peripheral.discoverAllServicesWait();

    let results = [];
    for(let service of services){
      if(service.uuid !== "fff0"){continue}
      let charas = await service.discoverAllCharacteristicsWait();

      expect(charas.length).to.be.equal(1);
      expect(charas[0].uuid).to.be.equal("fff1");

      for(let chara of charas){
        console.log(`service ${service.uuid} chara ${chara.uuid}  [${chara.properties}] `);


        expect(chara.canRead()).to.be.equal(false);
        let val = await chara.readWait();
        console.log(`service ${service.uuid} chara ${chara.uuid} value ${val}`);
        expect(val).to.be.deep.equal(undefined);

        let descrs = await chara.discoverAllDescriptorsWait();
        expect(descrs.length).to.be.equal(1);
        expect(descrs[0].uuid).to.be.equal("2901");
        for(let descr of descrs){
          console.log(`service ${service.uuid} chara ${chara.uuid} descr ${descr.uuid}`);
          let val = await descr.readWait();
          expect(val).to.be.deep.equal([104,101,108,108,111,32,119,114,111,108,100,32,99,104,97,114,97,99,116,101,114,105,115,116,105,99]);
          console.log(`service ${service.uuid} chara ${chara.uuid} descr ${descr.uuid} value ${val}`);
        }
      }
    }


  })




  it("nofify",async ()=>{

    obnizA.debugprint = true;
    obnizA.debugprintBinary = true;
    // obnizB.debugprint = true;

    var service = new obnizA.ble.service({"uuid" : "FFF0"});
    var characteristic = new obnizA.ble.characteristic({"uuid" : "FFF1", "text": "Hi"});
    characteristic.addProperty("write");
    characteristic.addProperty("read");
    characteristic.addProperty("notify");
    var descriptor = new obnizA.ble.descriptor({"uuid" : "2901", "text" : "hello wrold characteristic"});

    service.addCharacteristic(characteristic);
    characteristic.addDescriptor(descriptor);

    obnizA.ble.peripheral.addService(service);   // addServiceはaddCharacteristic,addDescriptorよりもあとに来る必要があります

    let ad = service.advData;
    obnizA.ble.setAdvData(ad);
    obnizA.ble.startAdvertisement();
    console.log("service created");

    await obnizA.pingWait();
    console.log("start scan");


    let peripheral = await obnizB.ble.startScanWait({uuids:["FFF0"]});
    if(!peripheral){
      throw new Error("NOT FOUND");
    }
    console.log("FOUND");

    expect(obnizA.ble.adv_data).to.be.deep.equal(peripheral.adv_data);

    let connected = await peripheral.connectWait();
    if(!connected){
      throw new Error("DISCONNECTED");
    }
    console.log("CONNECTED");

    let services = await peripheral.discoverAllServicesWait();

    let results = [];
    for(let service of services){
      if(service.uuid !== "fff0"){continue}
      let charas = await service.discoverAllCharacteristicsWait();

      expect(charas.length).to.be.equal(1);
      expect(charas[0].uuid).to.be.equal("fff1");

      for(let chara of charas){
        console.log(`service ${service.uuid} chara ${chara.uuid}  [${chara.properties}] `);


        expect(chara.canRead()).to.be.equal(false);
        let val = await chara.readWait();
        console.log(`service ${service.uuid} chara ${chara.uuid} value ${val}`);
        expect(val).to.be.deep.equal(undefined);

        let descrs = await chara.discoverAllDescriptorsWait();
        expect(descrs.length).to.be.equal(1);
        expect(descrs[0].uuid).to.be.equal("2901");
        for(let descr of descrs){
          console.log(`service ${service.uuid} chara ${chara.uuid} descr ${descr.uuid}`);
          let val = await descr.readWait();
          expect(val).to.be.deep.equal([104,101,108,108,111,32,119,114,111,108,100,32,99,104,97,114,97,99,116,101,114,105,115,116,105,99]);
          console.log(`service ${service.uuid} chara ${chara.uuid} descr ${descr.uuid} value ${val}`);
        }
      }
    }


  })

});

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}