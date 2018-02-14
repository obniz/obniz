var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require(global.appRoot + "/test/testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("obniz.libs.i2c", function () {
  beforeEach(function (done) {
    return testUtil.setupObnizPromise(this,done);   
  });
 
  afterEach(function (done) {
    return testUtil.releaseObnizePromise(this,done);
  });
  
  
  it("start",  function () {
    this.obniz.i2c0.start("master", 2, 3, 400000, "float"); 
    expect(this.obniz).send({i2c0:{"clock": 400000, "sda": 2, "scl":3,"pull_type":"float","mode":"master" }});
    expect(this.obniz).to.be.finished;
  });
  
  it("end",  function () {
    this.obniz.i2c0.start("master", 2, 3, 400000, "pullup"); 
    expect(this.obniz).send({i2c0:{"clock": 400000, "sda": 2, "scl":3,"pull_type":"pullup","mode":"master" }});
    
    this.obniz.i2c0.end();
    expect(this.obniz).send({i2c0:null});
    
  });
  
  it("write",  function () {
    this.obniz.i2c0.start("master", 2, 3, 400000, "pullup"); 
    expect(this.obniz).send({i2c0:{"clock": 400000, "sda": 2, "scl":3,"pull_type":"pullup","mode":"master" }});
    
    this.obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
    expect(this.obniz).send({i2c0:{address : 0x50, data:[0x00, 0x00, 0x12]}});
    
  });
  
  it.skip("write10bit フォーマット変更すべき",  function () {
    this.obniz.i2c0.start("master", 2, 3, 400000, "pullup"); 
    expect(this.obniz).send({i2c0:{"clock": 400000, "sda": 2, "scl":3,"pull_type":"pullup","mode":"master" }});
    
    this.obniz.i2c0.write10bit(0x50, [0x00, 0x00, 0x12]);
    expect(this.obniz).send({i2c0:{address : 0x50,address_type : "10bit" , data:[0x00, 0x00, 0x12]}});
    
  });
  
  
  it("readWait",  function () {
    this.obniz.i2c0.start("master", 2, 3, 400000, "pullup"); 
    expect(this.obniz).send({i2c0:{"clock": 400000, "sda": 2, "scl":3,"pull_type":"pullup","mode":"master" }});
    
    var r = this.obniz.i2c0.readWait(0x50, 3).then(function(value){
      expect(value).to.be.deep.equal([0x61, 0xF2, 0x1f]);
      expect(this.obniz).to.be.finished;
    }.bind(this));
    
    expect(this.obniz).send({i2c0:{address : 0x50, read:3}});
    setTimeout(function(){
      testUtil.receiveJson(this.obniz,  {"i2c0":{"address":0x50,"data":[0x61, 0xF2, 0x1f]}});
    }.bind(this),10);
    return r;
  });
  
  it.skip("readWait invalid length",  function () {
    this.obniz.i2c0.start("master", 2, 3, 400000, "pullup"); 
    expect(this.obniz).send({i2c0:{"clock": 400000, "sda": 2, "scl":3,"pull_type":"pullup","mode":"master" }});
    
    var r = this.obniz.i2c0.readWait(0x50, 3).then(function(value){
      expect(value).to.lengthOf(3);
      expect(this.obniz).to.be.finished;
    }.bind(this));
    
    expect(this.obniz).send({i2c0:{address : 0x50, read:3}});
    setTimeout(function(){
      testUtil.receiveJson(this.obniz,  {"i2c0":{"address":0x50,"data":[0x61, 0xF2]}});
    }.bind(this),10);
    return r;
  });
  it.skip("readWait withothers",  function () {
    this.obniz.i2c0.start("master", 2, 3, 400000, "pullup"); 
    expect(this.obniz).send({i2c0:{"clock": 400000, "sda": 2, "scl":3,"pull_type":"pullup","mode":"master" }});
    
    var r = this.obniz.i2c0.readWait(0x50, 3).then(function(value){
      expect(value).to.be.deep.equal([0x61, 0xF2, 0x1f]);
      expect(this.obniz).to.be.finished;
    }.bind(this));
    
    expect(this.obniz).send({i2c0:{address : 0x50, read:3}});
    setTimeout(function(){
      testUtil.receiveJson(this.obniz,  {"i2c0":{"address":0x51,"data":[0xaa, 0xbb, 0xcc]}});
      testUtil.receiveJson(this.obniz,  {"i2c0":{"address":0x50,"data":[0x61, 0xF2, 0x1f]}});
    }.bind(this),10);
    return r;
  });
  
  
  it.skip("readWait10bit",  function () {
    this.obniz.i2c0.start("master", 2, 3, 400000, "pullup"); 
    expect(this.obniz).send({i2c0:{"clock": 400000, "sda": 2, "scl":3,"pull_type":"pullup","mode":"master" }});
    
    var r = this.obniz.i2c0.read10bitWait(0x50, 3).then(function(value){
      expect(value).to.be.deep.equal([0x61, 0xF2, 0x1f]);
      expect(this.obniz).to.be.finished;
    }.bind(this));
    
    expect(this.obniz).send({i2c0:{address : 0x50, address_type : "10bit", read:3}});
    setTimeout(function(){
      testUtil.receiveJson(this.obniz,  {"i2c0":{"address":0x50,"data":[0x61, 0xF2, 0x1f]}});
    }.bind(this),10);
    return r;
  });
  
});
