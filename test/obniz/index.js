var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var Obniz = require(global.appRoot + "index.js");
var WSServer = require('ws').Server;

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
    var port = 3001;
    var server = createServer(port);
    var obniz = new Obniz("11111111", {obniz_server: "ws://localhost:" + port});
    
    await obniz.wait(100);    
    expect(obniz).to.be.instanceof(Obniz);
    expect(server.clients.size).to.equal(1);
    obniz.close();
    server.close();
  });

});

function createServer(port, velify) {

  var wss = new WSServer({host: "localhost", port: port, clientTracking: true});

  if (velify === null || velify === undefined || velify === true) {
    wss.verifyClient = function (info, accept) {
      accept(true);
    };
  } else {
    wss.verifyClient = function (info, accept) {
      accept(false, velify.statusCode, velify.message);
    };
  }
  wss.on('connection', function () {
    debugLog("connect");
  });
  return wss;
}



//
//var server = new WSServer({port:4000});
//server.verifyClient = function(info, accept){
//  accept(false, 500, "DataBase Error");
//};
//
//server.verifyClient = function(info, accept){
//  var obniz_id = parseObnizId(info.req);
//  accept(false, 404, "obniz "+obniz_id+" is not exist");
//};
//
//server.verifyClient = function(info, accept){
//  accept(false, 302, "host="+obniz.wsredirect);
//};
//
//server.verifyClient = function(info, accept){
//  var obniz_id = parseObnizId(info.req);
//  accept(false, 404, "obniz "+obniz_id+" is not online");
//};
