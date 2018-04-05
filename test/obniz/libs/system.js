var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require(global.appRoot + "/test/testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("obniz.libs.system", function () {
  beforeEach(function (done) {
    return testUtil.setupObnizPromise(this,done);   
  });
 
  afterEach(function (done) {
    return testUtil.releaseObnizePromise(this,done);
  });


  it("ping",  function () {
    let unixtime = 1522840296917;
    let rand = 4553670;
    this.obniz.pingWait(unixtime, rand);
    expect(this.obniz).send({ system: { ping : {key : [0,0,1,98,144,90,220,115,0,69,123,198]} } });
    expect(this.obniz).to.be.finished;
  });

  it("pingPong",  function () {
    let unixtime = 1522840296917;
    let rand = 4553670;
    let resolved = false;
    let promise = this.obniz.pingWait(unixtime, rand).then(()=>{resolved = true;});
    expect(this.obniz).send({ system: { ping : {key : [0,0,1,98,144,90,220,115,0,69,123,198]} } });
    expect(resolved).to.be.false;
    testUtil.receiveJson(this.obniz, { system: { pong : {key : [0,0,1,98,144,90,220,115,0,69,123,198], "obnizTime":4553670,"pingServerTime":1522840296035,"pongServerTime":1522840297892} }} );

    return promise;


  });
  

});
