var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var util = require(global.appRoot + "/test/testUtil.js");
chai.use(require('chai-like'));
chai.use(util.obnizAssert);

describe("obniz.libs.display", function () {
  beforeEach(function (done) {
    return util.setupObnizPromise(this,done);   
  });
 
  afterEach(function (done) {
    return util.releaseObnizePromise(this,done);
  });
  
  
  it("clear",  function () {
    this.obniz.display.clear();
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({display:{clear:true}});
    expect(this.obniz).to.be.finished;
  });
  it("print",  function () {
    this.obniz.display.print("Hello!");
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({display:{text:"Hello!"}});
    expect(this.obniz).to.be.finished;
  });
  it("print_bool",  function () {
    this.obniz.display.print(true);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({display:{text:"true"}});
    expect(this.obniz).to.be.finished;
  });
  it("qr",  function () {
    this.obniz.display.qr("https://obniz.io");
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({
      "display": {
        "qr": {
          "data": "https://obniz.io"
        }
      }
    });
    expect(this.obniz).to.be.finished;
  });
  it("qr-low",  function () {
    this.obniz.display.qr("HELLO!", "L");
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({
      "display": {
        "qr": {
          "correction": "L",
          "data": "HELLO!"
        }
      }
    });
    expect(this.obniz).to.be.finished;
  });
  it("qr-high",  function () {
    this.obniz.display.qr("p8baerv9uber:q", "H");
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({
      "display": {
        "qr": {
          "correction": "H",
          "data": "p8baerv9uber:q"
        }
      }
    });
    expect(this.obniz).to.be.finished;
  });
});
