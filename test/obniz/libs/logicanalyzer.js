var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require(global.appRoot + "/test/testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("obniz.libs.logicanalyser", function () {
  beforeEach(function (done) {
    return testUtil.setupObnizPromise(this,done);   
  });
 
  afterEach(function (done) {
    return testUtil.releaseObnizePromise(this,done);
  });
  
  
  it("start",  function () {
    this.obniz.logicanalyzer.start(1, 0.1, 100); 
  
    expect(this.obniz).send({logicanalyzer: { interval: 0.1, io:[1] , length:100}});
    expect(this.obniz).to.be.finished;
});
  
  it("startWithTriger",  function () {
    this.obniz.logicanalyzer.start(1, 0.1, 100, false, 3); 
    
    expect(this.obniz).send({logicanalyzer: { interval: 0.1, io:[1] , length:100, triger : {samples:3, value:false}}});
    expect(this.obniz).to.be.finished;
  });
  it("startWithTriger2",  function () {
    this.obniz.logicanalyzer.start(1, 0.1, 100, 1, 3); 
    
    expect(this.obniz).send({logicanalyzer: { interval: 0.1, io:[1] , length:100, triger : {samples:3, value:1}}});
    expect(this.obniz).to.be.finished;
  });
  
  it("onmeasured",  function () {
    var stub = sinon.stub();
    this.obniz.logicanalyzer.start(1, 0.1, 100, false, 3); 
    
    expect(this.obniz).send({logicanalyzer: { interval: 0.1, io:[1] , length:100, triger : {samples:3, value:false}}});
    this.obniz.logicanalyzer.onmeasured = stub;
    var data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255];
    testUtil.receiveJson(this.obniz, {"logicanalyzer":{"measured":data}});
    
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args[0]).to.be.deep.equal(data);
    
    expect(this.obniz).to.be.finished;
  });
  
  it("onmeasured need pin no");
  
  
  
});
