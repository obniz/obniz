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
    this.obniz.logicAnalyzer.start({io:1, interval:0.1, duration:100}); 
  
    expect(this.obniz).send([{logic_analyzer: { interval: 0.1, io:[1] , duration:100}}]);
    expect(this.obniz).to.be.finished;
});
  
  it("startWithTriger",  function () {
    this.obniz.logicAnalyzer.start({io:1, interval:0.1, duration:100, trigerValue:false,trigerValueSamples: 3}); 
    
    expect(this.obniz).send([{logic_analyzer: { interval: 0.1, io:[1] , duration:100, triger : {samples:3, value:false}}}]);
    expect(this.obniz).to.be.finished;
  });
  it("startWithTriger2",  function () {
    this.obniz.logicAnalyzer.start({io:1, interval:0.1, duration:100, trigerValue:1,trigerValueSamples: 3}); 
    
    expect(this.obniz).send([{logic_analyzer: { interval: 0.1, io:[1] , duration:100, triger : {samples:3, value:true}}}]);
    expect(this.obniz).to.be.finished;
  });
  
  it("onmeasured",  function () {
    var stub = sinon.stub();
    this.obniz.logicAnalyzer.start({io:1, interval:0.1, duration:100, trigerValue:false,trigerValueSamples: 3}); 
    
    expect(this.obniz).send([{logic_analyzer: { interval: 0.1, io:[1] , duration:100, triger : {samples:3, value:false}}}]);
    this.obniz.logicAnalyzer.onmeasured = stub;
    var data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255];
    testUtil.receiveJson(this.obniz, [{"logic_analyzer":{"data":data}}]);
    
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args[0]).to.be.deep.equal(data);
    
    expect(this.obniz).to.be.finished;
  });
  
  it("onmeasured need pin no");
  
  
  
});
