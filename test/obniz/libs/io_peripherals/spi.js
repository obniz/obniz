var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require("../../../testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("obniz.libs.spi", function () {
  beforeEach(function (done) {
    return testUtil.setupObnizPromise(this,done);   
  });
 
  afterEach(function (done) {
    return testUtil.releaseObnizePromise(this,done);
  });
  
  
  it("start",  function () {
    this.obniz.spi0.start({"clk": 0, "frequency": 1000000, "miso": 2, "mode":"master","mosi":1 }); 
    
    expect(this.obniz).send([{ io0: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io0: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io1: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([{spi0:{"clk": 0, "clock": 1000000, "miso": 2, "mode":"master","mosi":1 }}]);
    expect(this.obniz).to.be.finished;
  });
  
  
  it("write",  function () {
    this.obniz.spi0.start({"clk": 0, "frequency": 1000000, "miso": 2, "mode":"master" }); 
    expect(this.obniz).send([{ io0: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io0: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([{spi0:{"clk": 0, "clock": 1000000, "miso": 2, "mode":"master" }}]);
    
    var r = this.obniz.spi0.writeWait([0x12, 0x98]).then(function(value){
      expect(value).to.be.deep.equal([0x61, 0xF2]);
      expect(this.obniz).to.be.finished;
    }.bind(this));
    
    expect(this.obniz).send([{spi0:{data : [0x12, 0x98], read: true}}]);
    setTimeout(function(){
      testUtil.receiveJson(this.obniz, [{"spi0":{"data":[0x61, 0xF2]}}]);
    }.bind(this),10);
    return r;
  });


  it.skip("SPIで2byte送って3byte帰ってきたときの対応？",  function () {
    this.obniz.spi0.start({"clk": 0, "frequency": 1000000, "miso": 2, "mode":"master","mosi":1 }); 
    expect(this.obniz).send([{ io0: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io0: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io1: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([{spi0:{"clk": 0, "clock": 1000000, "miso": 2, "mode":"master","mosi":1 }}]);
    
    var r = this.obniz.spi0.writeWait([0x12, 0x98]).then(function(value){
      expect(value).to.be.deep.equal([0x61, 0xF2]);
      expect(this.obniz).to.be.finished;
    }.bind(this));
    
    expect(this.obniz).send([{spi0:{data : [0x12, 0x98], read: true}}]);
    setTimeout(function(){
      testUtil.receiveJson(this.obniz, [{"spi0":{"data":[0x61, 0xF2,0x34]}}]);
    }.bind(this),10);
    return r;
  });



  it("end",  function () {
    this.obniz.spi0.start({"clk": 0, "frequency": 1000000, "miso": 2, "mode":"master","mosi":1 });

    expect(this.obniz).send([{ io0: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io0: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io1: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([{spi0:{"clk": 0, "clock": 1000000, "miso": 2, "mode":"master","mosi":1 }}]);
    expect(this.obniz).to.be.finished;

    this.obniz.spi0.end();
    expect(this.obniz).send([{spi0:null}]);
    expect(this.obniz).to.be.finished;


  });

});
