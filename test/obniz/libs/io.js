var chai = require('chai');
chai.use(require('chai-json'));
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');



var Obniz = require(global.appRoot + "index.js");
var debugLog = console.log.bind(console);

describe("obniz.libs.io", function () {
  beforeEach(function (done) {
    return global.testUtil.setupObnizPromise(this,done);
    
  });
  
  afterEach(function (done) {
    return global.testUtil.releaseObnizePromise(this,done);
  });
  
  
  it("instance", async function () {
    this.obniz.io0.output(true);
    sinon.assert.calledOnce(this.obniz.socket.send);
    console.log(expect(this.obniz.socket.send.getCall(0).args).to.be.a)
    expect(this.obniz.socket.send.getCall(0).args).to.be.a.jsonFile().and.to.be.jsonObj({io1:true});
    
  });

});
