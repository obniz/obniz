/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var ws = require('ws');
var WSServer = ws.Server;
var Obniz = require(global.appRoot + "index.js");

chai.use(require('chai-like'));

var port = 3205;

var   serverDataCount = 0;
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
    serverDataCount = 0;
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
    
  },
  
  
  obnizAssert : function(_chai, utils){
     _chai.Assertion.addProperty('obniz', function() {
       var obj = utils.flag(this, 'object');
       new _chai.Assertion(obj).to.be.instanceof(Obniz);
     });
     
     _chai.Assertion.addMethod('send', function(expected) {
       var count = serverDataCount;
       serverDataCount++;
       
       var obniz = utils.flag(this, 'object');
       var stub = obniz.socket.send;
       
       var message  = "[obniz.send] no more send data. (called " + stub.callCount  + " times, but you expect "+count+"times) ";
       new _chai.Assertion(stub.callCount > count,message ).to.be.true;
       
       new _chai.Assertion(stub.args[count][0],"[obniz.send]invalid json").is.json;
       var val = JSON.parse(stub.args[count][0]);
       new _chai.Assertion(val).like(expected);
     });
     
     _chai.Assertion.addProperty('json', function(expected) {
       var string = utils.flag(this, 'object');
       new _chai.Assertion(string).is.string;
       var resolve = null;
       try {
         JSON.parse(string);
         resolve = true;
       }catch(err){
         resolve = false;
       }
       new _chai.Assertion(resolve).to.be.true;
     });
     
  }
  
  
  
  
  

};






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

module.exports = testUtil;