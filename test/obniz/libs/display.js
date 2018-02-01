var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var Obniz = require(global.appRoot + "index.js");
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
  
  
  it("clear", async function () {
    this.obniz.display.clear();
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({display:{clear:true}});
    expect(this.obniz).to.be.finished;
  });
  it("print", async function () {
    this.obniz.display.print("Hello!");
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({display:{text:"Hello!"}});
    expect(this.obniz).to.be.finished;
  });
  it("print_bool", async function () {
    this.obniz.display.print(true);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({display:{text:"true"}});
    expect(this.obniz).to.be.finished;
  });
});
