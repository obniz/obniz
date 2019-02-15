/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let sinon = require('sinon');
let ws = require('ws');
let WSServer = ws.Server;
let semver = require('semver');

let fs = require('fs');
let ejs = require('ejs');

const chai = require('chai');
const expect = chai.expect;

let Obniz;
let MochaChrome;
if (
  typeof window === 'undefined' &&
  process &&
  !semver.satisfies(process.versions.node, '>=7.6.0')
) {
  console.log('Loading obniz.js for node 6.10');
  Obniz = require('../index.js');
} else {
  console.log('Loading normal obniz.js');
  Obniz = require('../index.js');
  MochaChrome = require('mocha-chrome');
}

sinon.stub(Obniz.prototype, 'wsOnClose');

let serverDataCount = 0;
let errorDataCount = 0;
let testUtil = {
  log: console.log,
  isNode: function() {
    return typeof window === 'undefined';
  },
  createServer: function(port, velify) {
    let wss = new WSServer({
      host: 'localhost',
      port: port,
      clientTracking: true,
    });

    if (velify === null || velify === undefined || velify === true) {
      wss.verifyClient = function(info, accept) {
        accept(true);
      };
    } else {
      wss.verifyClient = function(info, accept) {
        accept(false, velify.statusCode, velify.message);
      };
    }

    return wss;
  },

  createObniz: function(port, obnizId, options) {
    let binary =
      options && options.binary !== undefined ? options.binary : false;
    return new Obniz(obnizId, {
      obniz_server: 'ws://localhost:' + port,
      binary: binary,
    });
  },

  setupNotConnectedYetObnizPromise: function(obj, done, options) {
    options = options || {};
    let stub = sinon.stub();
    stub.on = sinon.stub();
    stub.send = sinon.stub();
    stub.close = sinon.stub();
    stub.removeAllListeners = sinon.stub();
    stub.readyState = 1;

    sinon.stub(Obniz.prototype, 'wsconnect');
    obj.obniz = this.createObniz(100, '12345678', options);
    obj.obniz.socket = stub;
    obj.obniz.error = sinon.stub();
    obj.obniz.wsOnOpen();

    serverDataCount = 0;

    done();
  },

  setupObnizPromise: function(obj, done, options) {
    options = options || {};
    let stub = sinon.stub();
    stub.on = sinon.stub();
    stub.send = sinon.stub();
    stub.close = sinon.stub();
    stub.removeAllListeners = sinon.stub();
    stub.readyState = 1;

    sinon.stub(Obniz.prototype, 'wsconnect');
    obj.obniz = this.createObniz(100, '12345678', options);
    obj.obniz.socket = stub;
    obj.obniz.error = sinon.stub();
    obj.obniz.wsOnOpen();
    obj.obniz.wsOnMessage(
      JSON.stringify([
        {
          ws: {
            ready: true,
            obniz: {
              firmware: options.__firmware_ver || '1.1.0',
            },
          },
        },
      ])
    );
    serverDataCount = 0;

    expect(obj.obniz).send([{ ws: { reset_obniz_on_ws_disconnection: true } }]);

    done();
  },

  releaseObnizePromise: function(obj, done) {
    obj.obniz.close();
    obj.obniz = null;
    Obniz.prototype.wsconnect.restore();

    done();
  },

  waitForWebsocketCall: function(obj, n) {
    return new Promise(function(resolve, reject) {
      let count = 100;
      let wait = function() {
        if (obj.onServerMessage.callCount >= n) {
          resolve();
        } else {
          count--;
          if (count < 0) {
            reject('waitForWebsocketCall timeout');
            return;
          }
          setTimeout(wait, 10);
        }
      };
      setTimeout(wait, 10);
    });
  },
  receiveJson: function(obniz, jsonVal) {
    if (testUtil.isNode()) {
      let validator = require('./obnizJsonValidator');
      let results = validator.responseValidate(jsonVal, 'json');
      require('chai').expect(results.valid, results.errors).to.be.true;
    }

    obniz.wsOnMessage(JSON.stringify(jsonVal));
  },

  isValidCommandRequestJson: function(jsonVal) {
    if (testUtil.isNode()) {
      let validator = require('./obnizJsonValidator');
      let results = validator.requestValidate(jsonVal, 'wscommand');
      require('chai').expect(results.valid, results.errors).to.be.true;
      return results;
    }

    //browser
    return { valid: true };
  },

  isValidCommandResponseJson: function(jsonVal) {
    if (testUtil.isNode()) {
      let validator = require('./obnizJsonValidator');
      let results = validator.responseValidate(jsonVal, 'wscommand');
      require('chai').expect(results.valid, results.errors).to.be.true;
      return results;
    }
    //browser
    return { valid: true };
  },

  obnizAssert: function(_chai, utils) {
    _chai.Assertion.addProperty('obniz', function() {
      let obj = utils.flag(this, 'object');
      new _chai.Assertion(obj).to.be.instanceof(Obniz);
    });

    _chai.Assertion.addMethod('send', function(expected) {
      let count = serverDataCount;
      serverDataCount++;

      let obniz = utils.flag(this, 'object');
      let stub = obniz.socket.send;

      let message =
        '[obniz.send] no more send data. (called ' +
        stub.callCount +
        ' times, but you expect ' +
        (count + 1) +
        ' times) ';
      new _chai.Assertion(stub.callCount, message).to.be.above(count);

      new _chai.Assertion(
        stub.args[count][0],
        '[obniz.send]invalid json'
      ).is.json;
      let val = JSON.parse(stub.args[count][0]);
      new _chai.Assertion(val).to.deep.equal(expected);

      if (testUtil.isNode()) {
        let validator = require('./obnizJsonValidator');
        let validateErrors = validator.requestValidate(val, 'json');
        new _chai.Assertion(validateErrors.valid, validateErrors.errors).to.be
          .true;
      }
    });

    _chai.Assertion.addMethod('sendBinary', function(expected) {
      let count = serverDataCount;
      serverDataCount++;

      let obniz = utils.flag(this, 'object');
      let stub = obniz.socket.send;

      let message =
        '[obniz.send] no more send data. (called ' +
        stub.callCount +
        ' times, but you expect ' +
        (count + 1) +
        ' times) ';
      new _chai.Assertion(stub.callCount, message).to.be.above(count);

      new _chai.Assertion(stub.args[count][0]).to.deep.equal(expected);
    });

    _chai.Assertion.addProperty('finished', function(expected) {
      let obniz = utils.flag(this, 'object');
      let stub = obniz.socket.send;
      let message =
        '[obniz.send] not finished. (send: called ' +
        stub.callCount +
        ' times, but you expect ' +
        serverDataCount +
        ' times) ';
      new _chai.Assertion(stub.callCount, message).to.be.equal(serverDataCount);

      let errorStub = obniz.error;
      message =
        '[obniz.send] not finished. (error: called ' +
        errorStub.callCount +
        ' times, but you expect ' +
        errorDataCount +
        ' times) ';
      new _chai.Assertion(errorStub.callCount, message).to.be.equal(
        errorDataCount
      );
    });

    _chai.Assertion.addMethod('error', function(expected) {
      let count = errorDataCount;
      errorDataCount++;

      let obniz = utils.flag(this, 'object');
      let stub = obniz.error;

      let message =
        '[obniz.error] no more error data. (called ' +
        stub.callCount +
        ' times, but you expect ' +
        (count + 1) +
        ' times) ';
      new _chai.Assertion(stub.callCount, message).to.be.above(count);

      if (expected) {
        new _chai.Assertion(stub.args[count][0]).to.have.string(expected);
      }
    });

    _chai.Assertion.addProperty('json', function(expected) {
      let string = utils.flag(this, 'object');
      new _chai.Assertion(string).is.string;
      let resolve = null;
      try {
        JSON.parse(string);
        resolve = true;
      } catch (err) {
        resolve = false;
      }
      new _chai.Assertion(resolve).to.be.true;
    });
  },

  browser: function(url) {
    url = 'file://' + url;
    let options = {
      url,
      ignoreConsole: true,
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

    return runner
      .connect()
      .then(function() {
        return runner.run();
      })
      .then(function() {
        return result;
      });
  },

  ejs: function(url, param) {
    let data = fs.readFileSync(url, 'utf8');
    let html = ejs.render(data, param);
    let newFilename = url.replace('.', '_') + '.html';

    return new Promise(function(resolve, reject) {
      fs.writeFile(newFilename, html, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).then(function() {
      return testUtil.browser(newFilename);
    });
  },

  needBrowserTest: function() {
    if (
      typeof window === 'undefined' &&
      process &&
      !semver.satisfies(process.versions.node, '>=7.6.0')
    ) {
      return false;
    }
    return true;
  },

  checkJsonToBinary: function(requestJson, binary, self) {
    if (typeof requestJson === 'string') {
      requestJson = JSON.parse(requestJson);
    }
    if (
      Array.isArray(binary) &&
      binary.length > 0 &&
      typeof binary[0] === 'string'
    ) {
      binary = binary.join(' ');
    }
    if (typeof binary === 'string') {
      binary = binary.split(' ').map(function(val, index) {
        return parseInt(val, 16);
      });

      expect(binary.length).to.be.above(2);
    }
    binary = new Uint8Array(binary);

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = self.obniz.constructor.WSCommand.compress(
      self.obniz.wscommands,
      requestJson[0]
    );

    expect(compress).to.be.deep.equal(binary);
  },

  checkBinaryToJson: function(responseBinaryString, expectedJson, self) {
    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = self.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectedJson);
  },
};

module.exports = testUtil;
