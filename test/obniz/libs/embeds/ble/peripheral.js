var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require("../../../../testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("ble", function () {
  beforeEach(function (done) {
    return testUtil.setupObnizPromise(this, done);
  });

  afterEach(function (done) {
    return testUtil.releaseObnizePromise(this, done);
  });


  it("start", function () {
    this.obniz.ble.advertisement.start();

    expect(this.obniz).send([{ble: {advertisement: {adv_data: []}}}]);
    expect(this.obniz).to.be.finished;
  });

  it("stop", function () {
    this.obniz.ble.advertisement.end();

    expect(this.obniz).send([{ble: {advertisement: null}}]);
    expect(this.obniz).to.be.finished;
  });

  it("service generate ad",  function () {
    var service = new this.obniz.ble.service({
      uuid : "FFF0"
    });
    expect(service.advData).to.deep.equal({flags: ["general_discoverable_mode", "br_edr_not_supported"], serviceUuids: ["fff0"]});
    expect(this.obniz).to.be.finished;
  });

  it("set adv raw", function () {
    this.obniz.ble.advertisement.setAdvDataRaw([0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65]);
    this.obniz.ble.advertisement.start();
    expect(this.obniz).send([{ble: {advertisement: {adv_data: [0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65]}}}]);
    expect(this.obniz).to.be.finished;
  });

  it("set adv", function () {
    this.obniz.ble.advertisement.setAdvData({
      flags: ["general_discoverable_mode", "br_edr_not_supported"],
      manufacturerData: {
        companyCode: 0x004C,
        data: [0x02, 0x15, 0xC2, 0x8f, 0x0a, 0xd5, 0xa7, 0xfd, 0x48, 0xbe, 0x9f, 0xd0, 0xea, 0xe9, 0xff, 0xd3, 0xa8, 0xbb, 0x10, 0x00, 0x00, 0x10, 0xFF],
      }
    });
    this.obniz.ble.advertisement.start();

    expect(this.obniz).send([{ble: {advertisement: {adv_data: [0x02, 0x01, 0x06, 0x1A, 0xFF, 0x4C, 0x00, 0x02, 0x15, 0xC2, 0x8f, 0x0a, 0xd5, 0xa7, 0xfd, 0x48, 0xbe, 0x9f, 0xd0, 0xea, 0xe9, 0xff, 0xd3, 0xa8, 0xbb, 0x10, 0x00, 0x00, 0x10, 0xFF]}}}]);
    expect(this.obniz).to.be.finished;
  });

  it("set scan resp raw", function () {
    this.obniz.ble.advertisement.setScanRespDataRaw([0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65]);
    this.obniz.ble.advertisement.start();

    expect(this.obniz).send([{
      ble: {
        advertisement: {
          adv_data: [],
          scan_resp: [0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65]
        }
      }
    }]);
    expect(this.obniz).to.be.finished;
  });


  it("set scan resp", function () {
    this.obniz.ble.advertisement.setScanRespData({
      localName: "obniz BLE"
    });
    this.obniz.ble.advertisement.start();

    expect(this.obniz).send([{
      ble: {
        advertisement: {
          adv_data: [],
          scan_resp: [0x0A, 0x09, 0x6f, 0x62, 0x6e, 0x69, 0x7a, 0x20, 0x42, 0x4c, 0x45]
        }
      }
    }]);
    expect(this.obniz).to.be.finished;
  });


  it("start service", function () {
    var setting = {
      "uuid": "FFF0",
      "characteristics": [{
        "uuid": "FFF1",
        "data": [0x0e, 0x00], //data for dataArray or  text for string
        "descriptors": [{
          "uuid": "2901",   //Characteristic User Description
          "text": "hello wrold characteristic", //data for dataArray or  text for string
        }]
      }]
    };
    this.obniz.ble.peripheral.addService(setting);

    expect(this.obniz).send([{
      "ble": {
        "peripheral": {
          "services": [{
            "characteristics": [{
              "data": [14, 0],
              "descriptors": [{
                "data": [104, 101, 108, 108, 111, 32, 119, 114, 111, 108, 100, 32, 99, 104, 97, 114, 97, 99, 116, 101, 114, 105, 115, 116, 105, 99],
                "uuid": "2901"
              }],
              "uuid": "fff1"
            }], "uuid": "fff0"
          }]
        }
      }
    }]);
    expect(this.obniz).to.be.finished;
  });


  it("start service from object", function () {
    var service = new this.obniz.ble.service({"uuid": "FFF0"});
    var characteristic = new this.obniz.ble.characteristic({"uuid": "FFF1", "text": "Hi"});
    var descriptor = new this.obniz.ble.descriptor({"uuid": "2901", "text": "hello wrold characteristic"});

    service.addCharacteristic(characteristic);
    characteristic.addDescriptor(descriptor);

    this.obniz.ble.peripheral.addService(service);   // addServiceはaddCharacteristic,addDescriptorよりもあとに来る必要があります


    expect(this.obniz).send([{
      "ble": {
        "peripheral": {
          "services": [{
            "characteristics": [{
              "data": [72, 105],
              "descriptors": [{
                "data": [104, 101, 108, 108, 111, 32, 119, 114, 111, 108, 100, 32, 99, 104, 97, 114, 97, 99, 116, 101, 114, 105, 115, 116, 105, 99],
                "uuid": "2901"
              }],
              "uuid": "fff1"
            }], "uuid": "fff0"
          }]
        }
      }
    }]);
    expect(this.obniz).to.be.finished;
  });


  it("start service from json", function () {

    var setting = {services : [{
      "uuid": "FFF0",
      "characteristics": [{
        "uuid": "FFF1",
        "data": [72, 105], //data for dataArray or  text for string
        "descriptors": [{
          "uuid": "2901",   //Characteristic User Description
          "text": "hello wrold characteristic", //data for dataArray or  text for string
        }]
      }]
    }]};
    this.obniz.ble.peripheral.setJson(setting);

    expect(this.obniz).send([{
      "ble": {
        "peripheral": {
          "services": [{
            "characteristics": [{
              "data": [72, 105],
              "descriptors": [{
                "data": [104, 101, 108, 108, 111, 32, 119, 114, 111, 108, 100, 32, 99, 104, 97, 114, 97, 99, 116, 101, 114, 105, 115, 116, 105, 99],
                "uuid": "2901"
              }],
              "uuid": "fff1"
            }], "uuid": "fff0"
          }]
        }
      }
    }]);
    expect(this.obniz).to.be.finished;
  });


  it("check json", function () {
    var service = new this.obniz.ble.service({"uuid": "FFF0"});
    var characteristic = new this.obniz.ble.characteristic({"uuid": "FFF1", "text": "Hi"});
    var descriptor = new this.obniz.ble.descriptor({"uuid": "2901", "text": "hello wrold characteristic"});

    service.addCharacteristic(characteristic);
    characteristic.addDescriptor(descriptor);

    this.obniz.ble.peripheral.addService(service);   // addServiceはaddCharacteristic,addDescriptorよりもあとに来る必要があります


    expect(this.obniz).send([{
      "ble": {
        "peripheral": {
          "services": [{
            "characteristics": [{
              "descriptors": [{
                "data": [104, 101, 108, 108, 111, 32, 119, 114, 111, 108, 100, 32, 99, 104, 97, 114, 97, 99, 116, 101, 114, 105, 115, 116, 105, 99],
                "uuid": "2901"
              }],
              "data": [72, 105],
              "uuid": "fff1"
            }], "uuid": "fff0"
          }]
        }
      }
    }]);
    expect(this.obniz).to.be.finished;

    let serviceJson = JSON.stringify(this.obniz.ble.peripheral);
    expect(serviceJson).to.be.deep.equal( JSON.stringify({
      "services": [{
        "uuid": "fff0",
        "characteristics": [{
          "uuid": "fff1",
          "descriptors": [{
            "uuid": "2901",
            "data": [104, 101, 108, 108, 111, 32, 119, 114, 111, 108, 100, 32, 99, 104, 97, 114, 97, 99, 116, 101, 114, 105, 115, 116, 105, 99],
          }],
          "data": [72, 105],
        }]
      }]
    }));
  });



});
