

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var WSServer = require('ws').Server;
var path = require('path');

global.appRoot = path.resolve(__dirname + "/../") + "/";
var Obniz = require(global.appRoot + "index.js");

var port = 3205;

var testUtil = {
  log: console.log,
  createServer: function (port, velify) {
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

    return wss;
  },

  createObniz: function (port, obnizId) {
    return new Obniz(obnizId, {obniz_server: "ws://localhost:" + port});
  },

  setupObnizPromise: function (obj, done ) {
    
    new Promise(function (resolve) {
//      this.log("setup");
//      sinon.stub(console, 'error');
//      sinon.stub(console, 'log');
      var currentPort = port++;
      obj.server = this.createServer(currentPort);
      obj.server.on('connection', function () {
//        this.log("resolve");
        resolve();
      }.bind(this));
      obj.obniz = this.createObniz(currentPort, "12345678");
    }.bind(this))
        .then(function () {
//          this.log("set Message callback");
          expect(obj.server.clients.size).to.equal(1);
          obj.onServerMessage = sinon.stub();
          obj.server.clients.values().next().value.on("message", obj.onServerMessage);
          return obj.obniz.wait(1);
    }.bind(this)).then(function(){done();}.bind(this));
  },

  releaseObnizePromise: function (obj,done) {
//    this.log("releaseObnizePromise");
    obj.obniz.close();
    obj.obniz = null;
    
    obj.server.close();
    obj.server = null;
    done();

//    console.error.restore(); // Unwraps the spy
//    console.log.restore(); // Unwraps the spy

  }

};

global.testUtil = testUtil;

require('mocha-directory')();