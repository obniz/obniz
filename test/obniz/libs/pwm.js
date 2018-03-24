var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require(global.appRoot + "/test/testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("obniz.libs.pwm", function () {
  beforeEach(function (done) {
    return testUtil.setupObnizPromise(this,done);   
  });
 
  afterEach(function (done) {
    return testUtil.releaseObnizePromise(this,done);
  });
  
  
  it("getpwm",  function () {
    var pwm = this.obniz.getFreePwm();
    
    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });
  
  it("getpwm double",  function () {
    var pwm1 = this.obniz.getFreePwm();
    var pwm2 = this.obniz.getFreePwm();
    
    expect(this.obniz).to.be.finished;
    expect(pwm1).to.be.equal(this.obniz.pwm0);
    expect(pwm2).to.be.equal(this.obniz.pwm1);
  });
  it("getpwm released",  function () {
    var pwm1 = this.obniz.getFreePwm();
    expect(pwm1).to.be.equal(this.obniz.pwm0);
    pwm1.start(11);
    expect(this.obniz).send({pwm0:{"io": 11}});
    
    pwm1.end();   
    expect(this.obniz).send({pwm0: null});
    
    
    var pwm2 = this.obniz.getFreePwm();
    expect(pwm2).to.be.equal(this.obniz.pwm0);
    expect(this.obniz).to.be.finished;
  });
  
  it("start io",  function () {
    var pwm = this.obniz.getFreePwm();
    pwm.start(11);
    
    expect(this.obniz).send({pwm0:{"io": 11}});
    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });
  
  it("start io invalid",  function () {
    var pwm = this.obniz.getFreePwm();

    expect(function(){pwm.start(15);}).throw(Error);

    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });
  
  it("freq",  function () {
    var pwm = this.obniz.getFreePwm();
    pwm.start(10); 
    expect(this.obniz).send({pwm0:{"io": 10}});
    pwm.freq(1000);
    expect(this.obniz).send({pwm0:{"freq": 1000}});
    
    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });
  
  it("pulse",  function () {
    var pwm = this.obniz.getFreePwm();
    pwm.start(9); 
    expect(this.obniz).send({pwm0:{"io": 9}});
    pwm.freq(500); 
    expect(this.obniz).send({pwm0:{"freq": 500}});
    pwm.pulse(0.5); 
    expect(this.obniz).send({pwm0:{"pulse": 0.5}});
    
    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });
  
  it("duty",  function () {
    var pwm = this.obniz.getFreePwm();
    pwm.start(9); 
    expect(this.obniz).send({pwm0:{"io": 9}});
    pwm.freq(500); 
    expect(this.obniz).send({pwm0:{"freq": 500}});
    pwm.duty(0.5); 
    expect(this.obniz).send({pwm0:{"duty": 0.5}});
    
    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });
  
  it("modulate",  function () {
    var pwm = this.obniz.getFreePwm();
    pwm.start(11);   // start pwm. output at io11
    expect(this.obniz).send({pwm0:{"io": 11}});
    pwm.freq(38000); // set pwm frequency to 38khz
    expect(this.obniz).send({pwm0:{"freq": 38000}});

    // signal for room heater's remote signal
    var arr = [255,0,0,0,0,0,0,255,255,254,1,192,62,3,255,254,3,192,63,255,192,60,3,224,62,3,255,254,3,255,254,3,224,62,3,224,63,255,192,63,255,224,62,3,224,62,3,224,62,3,224,62,3,240,31,3,240,31,1,240,31,1,255,255,1,240,31,1,240,31,1,248,31,129,240,31,255,248,31,129,248,15,128,248,15,255,248,15,128,248,15,128,248,15,128,252,15,255,255];

    pwm.modulate("am", 0.00007, arr); // am modulate. symbol length = 70usec.

    expect(this.obniz).send({pwm0:{"modulate": {data : arr, "symbol_sec": 0.00007, "type": "am"}}});
    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });
  
  it("end",  function () {
    var pwm = this.obniz.getFreePwm();
    pwm.start(11); 
    expect(this.obniz).send({pwm0:{"io": 11}});
    pwm.end();   
    expect(this.obniz).send({pwm0: null});
    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });
});
