var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var Obniz = require(global.appRoot + "index.js");
var util = require(global.appRoot + "/test/testUtil.js");

const getPort = require('get-port');

var debugLog = console.log.bind(console);
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
    var obniz = new Obniz("OBNIZ_ID_HERE");
    expect(obniz).to.be.instanceof(Obniz);
    sinon.assert.calledOnce(console.error);
    sinon.assert.calledWith(console.error, "invalid obniz id");
  });


  it("connect", async function () {
    var port = await getPort();
    var server =  util.createServer(port);
    var obniz = new Obniz("11111111", {obniz_server: "ws://localhost:" + port});
    
    await obniz.wait(100);    
    expect(obniz).to.be.instanceof(Obniz);
    expect(server.clients.size,"before server remain connection").to.equal(1);
    obniz.close();
    server.close();
  });
  
  
  it("soft_redirect", async function () {
    var port = await getPort();
    var server = util.createServer(port);
    var port2 = await getPort();
    var server2 =  util.createServer(port2);
    var obniz = new Obniz("11111111", {obniz_server: "ws://localhost:" + port});
    expect(obniz).to.be.instanceof(Obniz);
    
    await obniz.wait(500);    
    expect(server.clients.size,"before server not connected").to.equal(1);
    var val = { ws: {redirect:"ws://localhost:" + port2}};
    server.clients.values().next().value.send(JSON.stringify(val));
    
    await obniz.wait(500);    
    expect(server.clients.size,"before server remain connection").to.equal(0);
    expect(server2.clients.size,"after server not connected").to.equal(1);
    obniz.close();
    server.close();
    server2.close();
  });

});
