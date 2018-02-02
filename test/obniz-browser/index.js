var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var util = require( "../testUtil.js");

const getPort = require('get-port');

describe("obniz.index", function () {
  beforeEach(function () {
    sinon.stub(console, 'error');
    sinon.stub(console, 'log');
  });

  afterEach(function () {
    console.error.restore(); // Unwraps the spy
    console.log.restore(); // Unwraps the spy
  });

  it("instance", function () {
    var obniz = util.createObniz(3000,"OBNIZ_ID_HERE");
    expect(obniz).to.be.obniz;
    sinon.assert.calledOnce(console.error);
    sinon.assert.calledWith(console.error, "invalid obniz id");
  });


  it("connect", function () {
    var port = undefined;
    var server   = undefined;
    var obniz = undefined;
    return getPort().then(function(p){
      port =  p;
      server =  util.createServer(port);
      obniz = util.createObniz(port,"11111111");
      return obniz.wait(100);
    }).then(function(){

      expect(obniz).to.be.obniz;
      expect(server.clients.size,"before server remain connection").to.equal(1);
      obniz.close();
      server.close();
    });
  });
  
  
  it("soft_redirect", function () {
    
    var port,server,port2,server2,obniz;
            
    return getPort().then(function (p) {
      port = p;
      server = util.createServer(port);
      return getPort();
    }).then(function (p2) {
      port2 = p2;
      server2 = util.createServer(port2);

      obniz = util.createObniz(port, "11111111");
      expect(obniz).to.be.obniz;
      return obniz.wait(500);
    }).then(function () {
      expect(server.clients.size, "before server not connected").to.equal(1);
      var val = {ws: {redirect: "ws://localhost:" + port2}};
      server.clients.values().next().value.send(JSON.stringify(val));
      return obniz.wait(500);
    }).then(function () {
      expect(server.clients.size, "before server remain connection").to.equal(0);
      expect(server2.clients.size, "after server not connected").to.equal(1);
      obniz.close();
      server.close();
      server2.close();
    });   
    
  });

});
