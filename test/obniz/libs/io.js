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
  
  
  it("output", async function () {
    this.obniz.io0.output(true);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io0:true});
  });

  it("outputType", async function () {
    this.obniz.io1.pullup();
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io1:{"pull_type":"pullup"}});
  });

  it("outputType2", async function () {
    this.obniz.io2.outputType("open-drain");
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io2:{"output_type": "open-drain"}});
  });


  it("pullup5v", async function () {
    this.obniz.io3.pullup5v();
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io3:{"pull_type": "pullup5v"}});
  });

  it("pullup", async function () {
    this.obniz.io4.pullup();
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io4:{"pull_type": "pullup"}});
  });

  it("pulldown", async function () {
    this.obniz.io5.pulldown();
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io5:{"pull_type": "pulldown"}});
  });

  it("float", async function () {
    this.obniz.io6.float();
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io6:{"pull_type": "float"}});
  });

  it("input", async function () {
    var stub = sinon.stub();
    this.obniz.io7.input(stub);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io7:{"direction": "input", "stream": true}});
    
    util.receiveJson(this.obniz,  {"io7":true});
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args[0]).to.be.true;
    
    util.receiveJson(this.obniz,  {"io7":false});
    sinon.assert.callCount(stub, 2);
    expect(stub.getCall(1).args[0]).to.be.false;
    
  });
  
  it("inputWaitTrue", function () {
    
    return new Promise(function(resolve, reject){
      this.obniz.io8.inputWait().then(function(result){
        expect(result).to.be.true;    
        resolve();
      });

      expect(this.obniz).to.be.obniz;
      expect(this.obniz).send({io8:{"direction": "input", "stream": false}});

      setTimeout(function(){    
        util.receiveJson(this.obniz,  {"io8":true});
      }.bind(this),10);
    }.bind(this));
    
  });
  it("inputWaitfalse", function () {
    
    return new Promise(function(resolve, reject){
      var success = true;
      this.obniz.io9.inputWait().then(function(result){
        success = false;
        reject("invalid pin");
      });
      expect(this.obniz).to.be.obniz;
      expect(this.obniz).send({io9:{"direction": "input", "stream": false}});

      setTimeout(function(){    
        util.receiveJson(this.obniz,  {"io10":true});
      }.bind(this),5);
      setTimeout(function(){    
        if(success){
          resolve();
        }
      }.bind(this),10);
    }.bind(this));
    
  });


});
