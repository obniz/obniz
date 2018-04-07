var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require(global.appRoot + "/test/testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("obniz.libs.display", function () {
  beforeEach(function (done) {
    return testUtil.setupObnizPromise(this,done);   
  });
 
  afterEach(function (done) {
    return testUtil.releaseObnizePromise(this,done);
  });
  
  
  it("clear",  function () {
    this.obniz.display.clear();
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{display:{clear:true}}]);
    expect(this.obniz).to.be.finished;
  });
  
  // if (this.obniz.isNode) { // ここどうやって書こうかな。。。。
  //   it("print",  function () {
  //     this.obniz.display.print("Hello!!");
  //     expect(this.obniz).to.be.obniz;
  //     expect(this.obniz).send([{display:{text:"Hello!!"}}]);
  //     expect(this.obniz).to.be.finished;
  //   });
  //   it("print_bool",  function () {
  //     this.obniz.display.print(true);
  //     expect(this.obniz).to.be.obniz;
  //     expect(this.obniz).send([{display:{text:"true"}}]);
  //     expect(this.obniz).to.be.finished;
  //   });
  // }

  it("qr",  function () {
    this.obniz.display.qr("https://obniz.io");
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{
      "display": {
        "qr": {
          "text": "https://obniz.io"
        }
      }
    }]);
    expect(this.obniz).to.be.finished;
  });
  it("qr-low",  function () {
    this.obniz.display.qr("HELLO!", "L");
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{
      "display": {
        "qr": {
          "correction": "L",
          "text": "HELLO!"
        }
      }
    }]);
    expect(this.obniz).to.be.finished;
  });
  it("qr-high",  function () {
    this.obniz.display.qr("p8baerv9uber:q", "H");
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{
      "display": {
        "qr": {
          "correction": "H",
          "text": "p8baerv9uber:q"
        }
      }
    }]);
    expect(this.obniz).to.be.finished;
  });

  it("setPinName",  function () {
    this.obniz.display.setPinName(0, "io", "input");
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{
      "display": {
        "pin_assign": {
          "0": {
            "module_name" : "io",
            "pin_name": "input"
          }
        }
      }
    }]);
    expect(this.obniz).to.be.finished;
  });

  it("setPinNames",  function () {
    this.obniz.display.setPinNames("io", {
      1: "input",
      2: "output"
    });
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{
      "display": {
        "pin_assign": {
          "1": {
            "module_name" : "io",
            "pin_name": "input"
          },
          "2": {
            "module_name" : "io",
            "pin_name": "output"
          }
        }
      }
    }]);
    expect(this.obniz).to.be.finished;
  });
});
