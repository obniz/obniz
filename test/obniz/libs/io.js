var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');



var Obniz = require(global.appRoot + "index.js");
var debugLog = console.log.bind(console);
var util = require(global.appRoot + "/test/testUtil.js");
chai.use(require('chai-like'));
chai.use(util.obnizAssert);

describe("obniz.libs.io", function () {
  beforeEach(function (done) {
    return util.setupObnizPromise(this,done);
    
  });
  
  afterEach(function (done) {
    return util.releaseObnizePromise(this,done);
  });
  
  
  it("instance", async function () {
    this.obniz.io0.output(true);
    expect(this.obniz).to.be.obniz;
    sinon.assert.calledOnce(this.obniz.socket.send);
    expect(this.obniz).send({io0:true});
//    expect(this.obniz.socket.send.getCall(0).args).to.be.like({io0:true});
    
  });

});
