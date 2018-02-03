var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require(global.appRoot + "/test/testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("obniz.libs.ad", function () {
  beforeEach(function (done) {
    return testUtil.setupObnizPromise(this,done);   
  });
 
  afterEach(function (done) {
    return testUtil.releaseObnizePromise(this,done);
  });
  
  
  it("start",  function () {
    this.obniz.uart0.start(1, 2, 9600, null, 7);  
    
    expect(this.obniz).send({uart0:{"tx": 1, "rx": 2, "baud":9600, "bits":7 }});
    
    this.obniz.uart0.send("Hi");
    
    expect(this.obniz).send({uart0:{"text":'Hi'}});
    expect(this.obniz).to.be.finished;
  });
  
  
  it("send",  function () {
    this.obniz.uart0.start(1, 2); // 1 is output, 2 is input
    
    expect(this.obniz).send({uart0:{"tx": 1, "rx": 2}});
    
    this.obniz.uart0.send("Hi");
    expect(this.obniz).send({uart0:{"text":'Hi'}});
    this.obniz.uart0.send(0x11);
    expect(this.obniz).send({uart0:{"data":[0x11]}});
    this.obniz.uart0.send([0x11, 0x45, 0x44]);
    expect(this.obniz).send({uart0:{"data":[0x11, 0x45, 0x44]}});
    this.obniz.uart0.send({success: true});
    expect(this.obniz).send({uart0:{"text":"{\"success\":true}"}});
    expect(this.obniz).to.be.finished;
  });
  
  
  it("end",  function () {
  
    this.obniz.uart0.start(1, 2); // 1 is output, 2 is input
    expect(this.obniz).send({uart0:{"tx": 1, "rx": 2}});
    
    this.obniz.uart0.send("Hi");
    expect(this.obniz).send({uart0:{"text":'Hi'}});
    
    this.obniz.uart0.end();
    expect(this.obniz).send({uart0:null});
    expect(this.obniz).to.be.finished;
  });
  
  
  
  it("onreceive",  function () {
  
    this.obniz.uart0.start(0, 1); // 0 is output, 1 is input
    expect(this.obniz).send({uart0:{"tx": 0, "rx": 1}});
    var stub = sinon.stub();
    this.obniz.uart0.onreceive = stub;
    
    testUtil.receiveJson(this.obniz,  {"uart0":{"data":[78,105,99,101]}});
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args[0]).to.be.deep.equal([78,105,99,101]);
    expect(stub.getCall(0).args[1]).to.be.equal("Nice");
    expect(this.obniz).to.be.finished;
    
  });
  
});
