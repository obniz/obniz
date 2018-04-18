const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');
const config = require('../config.js');

let obnizA, obnizB;

describe("7-ble", function () {

  this.timeout(120000);

  before(async () => {
    await new Promise((resolve) => {
      config.waitForConenct(() => {
        obnizA = config.obnizA;
        obnizB = config.obnizB;
        resolve();
      })
    });
    obnizA.debugprint =true;
    obnizA.debugprintBinary =true;
    obnizB.debugprint =true;
    obnizB.debugprintBinary =true;
    var service = new obnizA.ble.service({"uuid": "FFF0"});
    var characteristic = new obnizA.ble.characteristic({"uuid": "FFF1", "text": "Hi"});
    var descriptor = new obnizA.ble.descriptor({"uuid": "2901", "text": "hello wrold characteristic"});
    characteristic.addProperty("read");
    characteristic.addProperty("write");
    characteristic.addPermission("read");
    characteristic.addPermission("write");
    var characteristic2 = new obnizA.ble.characteristic({"uuid": "FFF2", "data": [101,51,214] });
    characteristic2.addProperty("read");
    characteristic2.addPermission("read");

    var characteristic3 = new obnizA.ble.characteristic({"uuid": "FFF3", "value": 92 });
    characteristic3.addProperty("read");
    characteristic3.addProperty("write");
    characteristic3.addProperty("notify");

    service.addCharacteristic(characteristic);
    characteristic.addDescriptor(descriptor);
    service.addCharacteristic(characteristic2);
    service.addCharacteristic(characteristic3);

    obnizA.ble.peripheral.addService(service);   // addServiceはaddCharacteristic,addDescriptorよりもあとに来る必要があります

    let ad = service.advData;
    obnizA.ble.advertisement.setAdvData(ad);
    obnizA.ble.advertisement.start();
    console.log("service created");
    await obnizA.pingWait();
    console.log("scannning");
    let peripheral = await obnizB.ble.scan.startOneWait({uuids: ["FFF0"]});
    if (!peripheral) {
      throw new Error("NOT FOUND");
    }
    console.log("FOUND");

    expect(obnizA.ble.advertisement.adv_data).to.be.deep.equal(peripheral.adv_data);

    let connected = await peripheral.connectWait();
    if (!connected) {
      throw new Error("DISCONNECTED");
    }
    console.log("CONNECTED");

    this.peripheral = peripheral;
    this.service = service;
  });



  it("discover", async () => {

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
        "characteristics": [
          {
            "properties": ["indicate"],
            "uuid": "2a05"
          }
        ],
        "uuid": "1801"
      },
      {
        "characteristics": [
          {
            "data": [],
            "properties": ["read"],
            "uuid": "2a00"
          },
          {
            "data": [ 0, 0],
            "properties": ["read"],
            "uuid": "2a01"
          },
          {
            "data": [ 0 ],
            "properties": ["read"],
            "uuid": "2aa6"
          }
        ],
        "uuid": "1800"
      },
      {
        "characteristics": [
          {
            "data": [72,105],
            "descriptors": [{
              "data": [104, 101, 108, 108, 111, 32, 119, 114, 111, 108, 100, 32, 99, 104, 97, 114, 97, 99, 116, 101, 114, 105, 115, 116, 105, 99],
              "uuid": "2901",
            }],
            "properties": ["read", "write"],
            "uuid": "fff1"
          },
          {
            "properties": ["read"],
            "data": [101,51,214],
            "uuid": "fff2"
          },
          {
            "properties": ["read","write","notify"],
            "data": [92],
            "uuid": "fff3"
          }
        ],
        "uuid": "fff0"
      }
    ])
  });

  it("create write", async () => {
    let chara  = this.peripheral.getService("fff0").getCharacteristic("fff1");
    expect(chara.canWrite()).to.be.equal(true);
    expect(chara.canWriteWithoutResponse()).to.be.equal(false);
    expect(chara.canRead()).to.be.equal(true);
    expect(chara.canNotify()).to.be.equal(false);
    expect(chara.canIndicate()).to.be.equal(false);
    let result = await chara.writeTextWait("hello");
    expect(result).to.be.equal(true);
    let data = await chara.readWait();
    expect(data).to.be.deep.equal([104, 101, 108, 108, 111]);

  });

  it("create write error", async () => {

    let chara  = this.peripheral.getService("fff0").getCharacteristic("fff2");
    expect(chara.canWrite()).to.be.equal(false);
    expect(chara.canWriteWithoutResponse()).to.be.equal(false);
    expect(chara.canRead()).to.be.equal(true);
    expect(chara.canNotify()).to.be.equal(false);
    expect(chara.canIndicate()).to.be.equal(false);
    let result = await chara.writeTextWait("hello");
    expect(result).to.be.equal(false);
    let data = await chara.readWait();
    expect(data).to.be.deep.equal([101,51,214]);
  });


  it("nofify", async () => {
    let notifyed = false;
    let targetChara = this.peripheral.getService("FFF0").getCharacteristic("FFF3");
    expect(targetChara.canWrite()).to.be.equal(true);
    expect(targetChara.canWriteWithoutResponse()).to.be.equal(false);
    expect(targetChara.canRead()).to.be.equal(true);
    expect(targetChara.canNotify()).to.be.equal(true);
    expect(targetChara.canIndicate()).to.be.equal(false);

    targetChara.registerNotify(function () {
      console.log("notify!");
      notifyed = true;
    });
    await obnizB.pingWait();
    this.service.getCharacteristic("FFF3").notify();
    await obnizA.pingWait();
    await obnizB.wait(10000);
    expect(notifyed).to.be.equal(true);

  })

});

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}