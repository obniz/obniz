/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var sinon = require('sinon');
var ws = require('ws');
var WSServer = ws.Server;
var semver = require('semver');

var fs = require('fs');
var ejs = require('ejs');

var Obniz;
if (typeof window === 'undefined' && process && !semver.satisfies(process.versions.node, '>=7.6.0')) {
  console.log("Loading obniz.js for node 6.10");
  Obniz = require("../index.js");
} else {
  console.log("Loading normal obniz.js");
  Obniz = require("../index.js");
  var MochaChrome = require('mocha-chrome');
}

sinon.stub(Obniz.prototype, 'wsOnClose');


var serverDataCount = 0;
var errorDataCount = 0;
var testUtil = {
  log: console.log,
  isNode: function () {
    return (typeof window === 'undefined') ? true : false;
  },
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

  createObniz: function (port, obnizId, options) {
    let binary = options && options.binary !== undefined ? options.binary : false;
    return new Obniz(obnizId, {obniz_server: "ws://localhost:" + port, binary: binary});
  },

  setupObnizPromise: function (obj, done, options) {
    options = options || {};
    var stub = sinon.stub();
    stub.on = sinon.stub();
    stub.send = sinon.stub();
    stub.close = sinon.stub();
    stub.removeAllListeners = sinon.stub();

    sinon.stub(Obniz.prototype, 'wsconnect');
    obj.obniz = this.createObniz(100, "12345678", options);
    obj.obniz.socket = stub;
    obj.obniz.error = sinon.stub();
    obj.obniz.wsOnOpen();
    serverDataCount = 0;
    done();
  },

  releaseObnizePromise: function (obj, done) {
    obj.obniz.close();
    obj.obniz = null;
    Obniz.prototype.wsconnect.restore();

    done();
  },

  waitForWebsocketCall: function (obj, n) {
    return new Promise(function (resolve, reject) {
      var count = 100;
      var wait = function () {
        if (obj.onServerMessage.callCount >= n) {
          resolve();
        } else {
          count--;
          if (count < 0) {
            reject("waitForWebsocketCall timeout");
            return;
          }
          setTimeout(wait, 10);

        }
      };
      setTimeout(wait, 10);
    });

  },
  receiveJson: function (obniz, jsonVal) {
    if (testUtil.isNode()) {
      var validator = require("./obnizJsonValidator");
      var results = validator.responseValidate(jsonVal, "json");
      require("chai").expect(results.valid, results.errors).to.be.true;

    }

    obniz.wsOnMessage(JSON.stringify(jsonVal));
  },


  isValidCommandRequestJson: function (jsonVal) {
    if (testUtil.isNode()) {
      var validator = require("./obnizJsonValidator");
      var results = validator.requestValidate(jsonVal, "wscommand");
      require("chai").expect(results.valid, results.errors).to.be.true;
      return results;
    }

    //browser
    return {valid: true};

  },

  isValidCommandResponseJson: function (jsonVal) {
    if (testUtil.isNode()) {
      var validator = require("./obnizJsonValidator");
      var results = validator.responseValidate(jsonVal, "wscommand");
      require("chai").expect(results.valid, results.errors).to.be.true;
      return results;
    }
    //browser
    return {valid: true};

  },


  obnizAssert: function (_chai, utils) {
    _chai.Assertion.addProperty('obniz', function () {
      var obj = utils.flag(this, 'object');
      new _chai.Assertion(obj).to.be.instanceof(Obniz);
    });

    _chai.Assertion.addMethod('send', function (expected) {
      var count = serverDataCount;
      serverDataCount++;

      var obniz = utils.flag(this, 'object');
      var stub = obniz.socket.send;

      var message = "[obniz.send] no more send data. (called " + stub.callCount + " times, but you expect " + (count + 1) + " times) ";
      new _chai.Assertion(stub.callCount, message).to.be.above(count);

      new _chai.Assertion(stub.args[count][0], "[obniz.send]invalid json").is.json;
      var val = JSON.parse(stub.args[count][0]);
      new _chai.Assertion(val).to.deep.equal(expected);

      if (testUtil.isNode()) {
        var validator = require("./obnizJsonValidator");
        var validateErrors = validator.requestValidate(val, "json");
        new _chai.Assertion(validateErrors.valid, validateErrors.errors).to.be.true;
      }
    });

    _chai.Assertion.addMethod('sendBinary', function (expected) {
      var count = serverDataCount;
      serverDataCount++;

      var obniz = utils.flag(this, 'object');
      var stub = obniz.socket.send;

      var message = "[obniz.send] no more send data. (called " + stub.callCount + " times, but you expect " + (count + 1) + " times) ";
      new _chai.Assertion(stub.callCount, message).to.be.above(count);

      new _chai.Assertion(stub.args[count][0]).to.deep.equal(expected);
    });


    _chai.Assertion.addProperty('finished', function (expected) {
      var obniz = utils.flag(this, 'object');
      var stub = obniz.socket.send;
      var message = "[obniz.send] not finished. (send: called " + stub.callCount + " times, but you expect " + (serverDataCount) + " times) ";
      new _chai.Assertion(stub.callCount, message).to.be.equal(serverDataCount);


      var errorStub = obniz.error;
      var message = "[obniz.send] not finished. (error: called " + errorStub.callCount + " times, but you expect " + (errorDataCount) + " times) ";
      new _chai.Assertion(errorStub.callCount, message).to.be.equal(errorDataCount);

    });


    _chai.Assertion.addMethod('error', function (expected) {
      var count = errorDataCount;
      errorDataCount++;

      var obniz = utils.flag(this, 'object');
      var stub = obniz.error;

      var message = "[obniz.error] no more error data. (called " + stub.callCount + " times, but you expect " + (count + 1) + " times) ";
      new _chai.Assertion(stub.callCount, message).to.be.above(count);

      if (expected) {
        new _chai.Assertion(stub.args[count][0]).to.have.string(expected);
      }
    });

    _chai.Assertion.addProperty('json', function (expected) {
      var string = utils.flag(this, 'object');
      new _chai.Assertion(string).is.string;
      var resolve = null;
      try {
        JSON.parse(string);
        resolve = true;
      } catch (err) {
        resolve = false;
      }
      new _chai.Assertion(resolve).to.be.true;
    });


  },

  browser: function (url) {
    var url = "file://" + url;
    options = {
      url,
      ignoreConsole: true
    };
    const runner = new MochaChrome(options);
    const result = new Promise((resolve, reject) => {
      runner.on('ended', stats => {
        resolve(stats);
      });

      runner.on('failure', message => {
        reject(message);
      });
    });

    return runner.connect().then(function () {
      return runner.run();
    }).then(function () {
      return result;
    });
  },

  ejs: function (url, param) {
    var data = fs.readFileSync(url, 'utf8');
    html = ejs.render(data, param);
    var newFilename = url.replace(".", "_") + ".html";

    return new Promise(function (resolve, reject) {
      fs.writeFile(newFilename, html, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).then(function () {
      return testUtil.browser(newFilename);
    });
  },

  needBrowserTest: function () {
    if (typeof window === 'undefined' && process && !semver.satisfies(process.versions.node, '>=7.6.0')) {
      return false;
    }
    return true;
  }

};

module.exports = testUtil;

