'no_html_test_build';

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var path = require('path');

var testUtil = require("../testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

const getPort = require('get-port');

var waitMs = 50;

function wait(msec) {
  return new Promise(resolve => setTimeout(resolve, msec));
}



describe("obniz.index", function () {
  beforeEach(function () {
  });

  afterEach(function () {
  });

  it("instance", function () {
    sinon.stub(console, 'error');
    sinon.stub(console, 'log');
    var obniz = testUtil.createObniz(3000,"OBNIZ_ID_HERE");
    expect(obniz).to.be.obniz;
    sinon.assert.calledOnce(console.error);
    sinon.assert.calledWith(console.error, "invalid obniz id");
    console.error.restore(); // Unwraps the spy
    console.log.restore(); // Unwraps the spy
  });


  it("connect", function () {
    var port = undefined;
    var server   = undefined;
    var obniz = undefined;
    return getPort().then(function(p){
      port =  p;
      server =  testUtil.createServer(port);
      
      var result = new Promise(function(resolve,reject){
        server.on('connection',function(){resolve();});
      });
      
      obniz = testUtil.createObniz(port,"11111111");
      return result;
    }).then(function(){
      return wait(waitMs);
    }).then(function(){

      expect(obniz).to.be.obniz;
      expect(server.clients.size,"server connection").to.equal(1);
      obniz.close();
      server.close();
    });
  });
  
  
  it("soft_redirect", function () {
    
    var port,server,port2,server2,obniz;
            
    return getPort().then(function (p) {
      port = p;
      server = testUtil.createServer(port);
      return getPort();
    }).then(function (p2) {
      port2 = p2;
      server2 = testUtil.createServer(port2);

      var result = new Promise(function(resolve,reject){
        server.on('connection',function(){resolve();});
      });
      
      obniz = testUtil.createObniz(port, "11111111");
      expect(obniz).to.be.obniz;
      return result;
    }).then(function(){
      return wait(waitMs);
    }).then(function () {
      expect(server.clients.size, "before server not connected").to.equal(1);
      var result = new Promise(function(resolve,reject){
        server2.on('connection',function(){resolve();});
      });
     
      var val = [{ws: {redirect: "ws://localhost:" + port2}}];

      if(testUtil.isNode()){
        var validator = require("../obnizJsonValidator");
        var results = validator.responseValidate(val,"json");
        require("chai").expect(results.valid,results.errors).to.be.true;
      }

      server.clients.values().next().value.send(JSON.stringify(val));
      
      return result;
    }).then(function(){
      return wait(waitMs);
    }).then(function () {
      expect(server.clients.size, "before server remain connection").to.equal(0);
      expect(server2.clients.size, "after server not connected").to.equal(1);
      obniz.close();
      server.close();
      server2.close();
    });   
    
  });
  
  if(testUtil.needBrowserTest()){
  
    it("browser", function () {
      this.timeout(10000);
      var port1, port2, port3, server1, server2, server3;
      
      return getPort().then(function (p) {
        port1 = p;
        server1 = testUtil.createServer(port1);
        return getPort();
      }).then(function (p) {
        port2 = p;
        server2 = testUtil.createServer(port2);
        return getPort();
      }).then(function (p) {
        port3 = p;
        server3 = testUtil.createServer(port3);
        
        server2.on('connection',function(client){
          setTimeout(function(){
            var val = [{ws: {redirect: "ws://localhost:" + port3}}];
             server2.clients.values().next().value.send(JSON.stringify(val));
          },10);
        });
     
      
        return getPort();
      }).then(function(){
        return testUtil.ejs(path.resolve(__dirname,"index.ejs"), {port1, port2, port3});
      }).then(function(val){
        expect(val.failures).to.equal(0);
        return wait(waitMs);
      }).then(function(){    
        server1.close();
        server2.close();  
        server3.close();
      });
    
    });
  }




  it("compress",  function () {

    new Promise(function(resolve){testUtil.setupObnizPromise(this, resolve,{binary:true})})
        .then(function(){

          expect(this.obniz).to.be.obniz;
          expect(this.obniz).to.be.finished;  // input queue

          this.obniz.io1.output(true);

          return wait(5);
        }).then(function(){

        expect(this.obniz).sendBinary(new Uint8Array([ 2, 0, 2, 1, 1 ]));
        expect(this.obniz).to.be.finished;

        return new Promise((resolve)=>{testUtil.releaseObnizePromise(this,resolve);});
    })
   });


  function wait(ms){
    return new Promise((resolve)=>{setTimeout(resolve,ms)});
  }

});
