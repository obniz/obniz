

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var ws = require('ws');
var WSServer = ws.Server;
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
    var stub = spyOnModule('ws');
    stub.prototype.on = sinon.stub();
    stub.prototype.send = sinon.stub();
    stub.prototype.close = sinon.stub();
    stub.prototype.removeAllListeners = sinon.stub();
    obj.obniz = this.createObniz(100, "12345678");
    obj.obniz.wsOnOpen();
    done();
  },

  releaseObnizePromise: function (obj,done) {
    obj.obniz.close();
    obj.obniz = null;
    
    done();
  },
  
  waitForWebsocketCall : function(obj, n){
    return new Promise(function(resolve, reject){
      var count = 100;
      var wait = function(){
        if(obj.onServerMessage.callCount >= n ){
         resolve();
        }else{
          count--;
          if(count < 0){
            reject("waitForWebsocketCall timeout");return;
          }
          setTimeout(wait,10);
          
        }
      };
      setTimeout(wait,10);
    });
    
  }
  

};

global.testUtil = testUtil;

var moduleSpies = {};
var originalJsLoader = require.extensions['.js'];

spyOnModule = function spyOnModule(module) {
  var path          = require.resolve(module);
  var spy           = sinon.stub();
  moduleSpies[path] = spy;
  delete require.cache[path];
  return spy;
};

require.extensions['.js'] = function (obj, path) {
  if (moduleSpies[path])
    obj.exports = moduleSpies[path];
  else
    return originalJsLoader(obj, path);
}

afterEach(function() {
  for (var path in moduleSpies) {
    delete moduleSpies[path];
  }
});

require('mocha-directory')();