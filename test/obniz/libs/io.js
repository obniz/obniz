var chai = require('chai');
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
    expect(this.server.clients.size).to.equal(1);
    
    this.obniz.io0.output(true);
    await this.obniz.wait(1000);
    sinon.assert.calledOnce(this.onServerMessage);
    assert(1==1);
  });

});
