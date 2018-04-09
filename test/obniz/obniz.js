var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require("../testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("obniz", function () {
  beforeEach(function (done) {
    return testUtil.setupObnizPromise(this,done);
  });

  afterEach(function (done) {
    return testUtil.releaseObnizePromise(this,done);
  });


  it("message",  function () {

    var targets = [
      "1234-1231",
      "1234-1230"];

    this.obniz.message(targets, "pressed");

    expect(this.obniz).send([{
      "message":{
        "data": "pressed",
        "to": [
          "1234-1231",
          "1234-1230"
        ]
      }
    }]);
    expect(this.obniz).to.be.finished;
  });



  it("message receive",  function () {

    this.obniz.onmessage = sinon.stub();

    testUtil.receiveJson(this.obniz, [
      {
        "message": {
          "data": "button pressed",
          "from": "1234-5678"
        }
      }
    ]);


    expect(this.obniz.onmessage.callCount).to.be.equal(1);
    expect(this.obniz.onmessage.getCall(0).args.length).to.be.equal(2);
    expect(this.obniz.onmessage.getCall(0).args[0]).to.be.equal("button pressed");
    expect(this.obniz.onmessage.getCall(0).args[1]).to.be.equal("1234-5678");


  });


  it("message receive2",  function () {

    this.obniz.onmessage = sinon.stub();

    testUtil.receiveJson(this.obniz, [
      {
        "message": {
          "data": [1,2,3,4,5,10],
          "from": null
        }
      }
    ]);


    expect(this.obniz.onmessage.callCount).to.be.equal(1);
    expect(this.obniz.onmessage.getCall(0).args.length).to.be.equal(2);
    expect(this.obniz.onmessage.getCall(0).args[0]).to.be.deep.equal([1,2,3,4,5,10]);
    expect(this.obniz.onmessage.getCall(0).args[1]).to.be.equal(null);


  });


  it("resetOnDisconnect",  function () {

    this.obniz.resetOnDisconnect(false);
    expect(this.obniz).send([{ ws: {  "reset_obniz_on_ws_disconnection": false } }]);
    expect(this.obniz).to.be.finished;
  });



  it("ready",  function () {

    this.obniz.onconnect = sinon.stub();
    testUtil.receiveJson(this.obniz, [{ ws: {  "ready": true } }]);

    expect(this.obniz.onconnect.callCount).to.be.equal(1);
    expect(this.obniz.onconnect.getCall(0).args.length).to.be.equal(1);
    expect(this.obniz.onconnect.getCall(0).args[0]).to.be.equal(this.obniz);

    expect(this.obniz).send([{"ws":{"reset_obniz_on_ws_disconnection":true}}]);


    expect(this.obniz).to.be.finished;
  });


  it("warning",  function () {

    this.obniz.warning = sinon.stub();
    testUtil.receiveJson(this.obniz, [
      {
        "debug": {
          "warning": {
            "message": "unknown command"
          }
        }
      }
    ]);

    expect(this.obniz.warning.callCount).to.be.equal(1);
    expect(this.obniz.warning.getCall(0).args.length).to.be.equal(1);
    expect(this.obniz.warning.getCall(0).args[0]).to.be.deep.equal({
      "alert": "warning",
      "message": "Warning: unknown command"
    });

    expect(this.obniz).to.be.finished;
  });



  it("error",  function () {

    let error = this.obniz.error;
    this.obniz.error = sinon.stub();
    testUtil.receiveJson(this.obniz, [
      {
        "debug": {
          "error": {
            "message": "voltage down"
          }
        }
      }
    ]);

    expect(this.obniz.error.callCount).to.be.equal(1);
    expect(this.obniz.error.getCall(0).args.length).to.be.equal(1);
    expect(this.obniz.error.getCall(0).args[0]).to.be.deep.equal({
      "alert": "error",
      "message": "Error: voltage down"
    });
    this.obniz.error = error;

    expect(this.obniz).to.be.finished;
  });







});
