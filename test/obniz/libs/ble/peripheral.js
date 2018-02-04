var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require(global.appRoot + "/test/testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("ble", function () {
  beforeEach(function (done) {
    return testUtil.setupObnizPromise(this,done);   
  });
 
  afterEach(function (done) {
    return testUtil.releaseObnizePromise(this,done);
  });
  

    it("start",  function () {
      this.obniz.ble.startAdvertisement(); 

      expect(this.obniz).send({ble:{ advertisement: {status:"start"}}});
      expect(this.obniz).to.be.finished;
    });
    
    it("stop",  function () {
      this.obniz.ble.stopAdvertisement(); 

      expect(this.obniz).send({ble:{ advertisement: {status:"stop"}}});
      expect(this.obniz).to.be.finished;
    });
    
     
    it("set adv raw",  function () {
      this.obniz.ble.setAdvDataRaw([0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
      expect(this.obniz).send({ble:{ advertisement: {adv_data:[0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]}}});
      expect(this.obniz).to.be.finished;
    });
    
    it("set adv",  function () {
      this.obniz.ble.setAdvData({
        flags: ["general_discoverable_mode","br_edr_not_supported"],
        manufacturerData:{
          campanyCode : 0x004C,
          data : [0x02,0x15, 0xC2, 0x8f, 0x0a, 0xd5, 0xa7, 0xfd, 0x48, 0xbe, 0x9f, 0xd0, 0xea, 0xe9, 0xff, 0xd3, 0xa8, 0xbb,0x10,0x00,0x00,0x10,0xFF],
        }
      });

      expect(this.obniz).send({ble:{ advertisement: {adv_data:[0x02, 0x01, 0x06, 0x1A, 0xFF, 0x4C, 0x00,0x02,0x15, 0xC2, 0x8f, 0x0a, 0xd5, 0xa7, 0xfd, 0x48, 0xbe, 0x9f, 0xd0, 0xea, 0xe9, 0xff, 0xd3, 0xa8, 0xbb,0x10,0x00,0x00,0x10,0xFF ]}}});
      expect(this.obniz).to.be.finished;
    });
    
    it("set scan resp raw",  function () {
      this.obniz.ble.setScanRespDataRaw([0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);

      expect(this.obniz).send({ble:{ advertisement: {scan_resp:[0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]}}});
      expect(this.obniz).to.be.finished;
    });
    
    
    it("set scan resp",  function () {
      this.obniz.ble.setScanRespData({
        localName : "obniz BLE"
      });

      expect(this.obniz).send({ble:{ advertisement: {scan_resp:[0x0A, 0x09, 0x6f, 0x62, 0x6e, 0x69, 0x7a, 0x20, 0x42, 0x4c, 0x45  ]}}});
      expect(this.obniz).to.be.finished;
    });
    
   
  
  
  
});
