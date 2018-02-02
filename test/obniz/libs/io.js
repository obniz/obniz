var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
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
  
  
  it("output", function () {
    this.obniz.io0.output(true);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io0:true});
    expect(this.obniz).to.be.finished;
  });
  
  it("output-over-pin", function () {
    expect(function(){
      this.obniz.io20.output(true);
    }).to.throw("Cannot read property");
    expect(this.obniz).to.be.finished;
  });

  it("outputType", function () {
    this.obniz.io1.pullup();
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io1:{"pull_type":"pullup"}});
    expect(this.obniz).to.be.finished;
  });
  
  it("outputType2", function () {
    this.obniz.io2.outputType("open-drain");
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io2:{"output_type": "open-drain"}});
    expect(this.obniz).to.be.finished;
  });


  it("pullup5v", function () {
    this.obniz.io3.pullup5v();
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io3:{"pull_type": "pullup5v"}});
    expect(this.obniz).to.be.finished;
  });

  it("pullup", function () {
    this.obniz.io4.pullup();
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io4:{"pull_type": "pullup"}});
    expect(this.obniz).to.be.finished;
  });

  it("pulldown", function () {
    this.obniz.io5.pulldown();
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io5:{"pull_type": "pulldown"}});
    expect(this.obniz).to.be.finished;
  });

  it("float", function () {
    this.obniz.io6.float();
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({io6:{"pull_type": "float"}});
    expect(this.obniz).to.be.finished;
  });

  it("input", function () {
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
    
    expect(this.obniz).to.be.finished;
    
  });
  
  it("inputWaitTrue", function () {
    
    return new Promise(function(resolve, reject){
      this.obniz.io8.inputWait().then(function(result){
        expect(result).to.be.true;    
        resolve();
      });

      expect(this.obniz).to.be.obniz;
      expect(this.obniz).send({io8:{"direction": "input", "stream": false}});
      expect(this.obniz).to.be.finished;

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
      expect(this.obniz).to.be.finished;

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



  it("ioAnimation", function () {
    var obniz = this.obniz;
    this.obniz.io.animation("animation-1", "loop", [
      {
        duration: 10,
        state: function(index){ // index = 0
          obniz.io0.output(false);
          obniz.io1.output(true);
        }
      },{
        duration: 10,
        state: function(index){ // index = 1
          obniz.io0.output(true);
          obniz.io1.output(false);
        }
      }
    ]);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send({
        "io": {
          "animation": {
            "name": "animation-1",
            "states": [
              {
                "duration": 10,
                "state": {
                  "io0": false,
                  "io1": true
                }
              },
               {
                 "duration": 10,
                 "state": {
                   "io0": true,
                   "io1": false
                 }
               }
             ],
             "status": "loop"
           }
         }
      });
    expect(this.obniz).to.be.finished;
      
    
  });
  
  it("ioAnimation-pause", function () {
    
    this.obniz.io.animation("animation-1", "pause");
    
    expect(this.obniz).send( 
        {
          "io": 
          {
            "animation" : {
            "name" : "animation-1",
            "status" : "pause"
          }
        }
    });
   });
   
   
   
  it("ioAnimation-pause", function () {
    
    this.obniz.io.animation("anim", "pause");
    
    expect(this.obniz).send( 
        {
          "io": 
          {
            "animation" : {
            "name" : "anim",
            "status" : "pause"
          }
        }
    });
   });
   
  it("ioAnimation-resume", function () {
    
    this.obniz.io.animation("a", "resume");
    
    expect(this.obniz).send( 
        {
          "io": 
          {
            "animation" : {
            "name" : "a",
            "status" : "resume"
          }
        }
    });
   });
});
