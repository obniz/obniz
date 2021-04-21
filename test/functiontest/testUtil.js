class TestUtil {
  constructor() {
    if (this.isNode()) {
      this.sinon = require('sinon');
      this.Obniz = require('../../index.js');
      this.chai = require('chai');
      this.expect = this.chai.expect;

      this.ws = require('ws');
      this.WSServer = this.ws.Server;
      this.semver = require('semver');

      this.fs = require('fs');
      this.path = require('path');
      this.ejsInstance = require('ejs');

      this.chai.use(require('chai-like'));

      this.MochaChrome = require('mocha-chrome');
    } else {
      // eslint-disable-next-line no-undef
      this.sinon = sinon;
      // eslint-disable-next-line no-undef
      this.Obniz = Obniz;
      // eslint-disable-next-line no-undef
      this.chai = chai;
      this.expect = this.chai.expect;

      this.ws = null;
      this.WSServer = null;
      this.semver = null;

      this.fs = null;
      this.path = null;
      this.ejsInstance = null;

      this.MochaChrome = null;
    }

    // this.sinon.stub(this.Obniz.prototype, 'wsOnClose');
    this.serverDataCount = 0;
    this.errorDataCount = 0;

    this.chai.use(this.obnizAssert.bind(this));
  }

  log(...args) {
    console.log(...args);
  }

  isNode() {
    return typeof window === 'undefined';
  }

  createServer(port, velify) {
    let wss = new this.WSServer({
      host: 'localhost',
      port: port,
      clientTracking: true,
    });

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
  }

  createObniz(port, obnizId, options) {
    let binary =
      options && options.binary !== undefined ? options.binary : false;
    return new this.Obniz(obnizId, {
      obniz_server: 'ws://localhost:' + port,
      binary: binary,
    });
  }

  async setupNotConnectedYetObnizPromise(obj, done, options) {
    options = options || {};
    let stub = this.sinon.stub();
    stub.on = this.sinon.stub();
    stub.send = this.sinon.stub();
    stub.close = this.sinon.stub();
    stub.removeAllListeners = this.sinon.stub();
    stub.readyState = 0;

    this.sinon
      .stub(this.Obniz.prototype, '_createCloudSocket')
      .callsFake(() => {
        return stub;
      });
    obj.obniz = this.createObniz(100, '12345678', options);
    obj.obniz.error = this.sinon.stub();
    await new Promise((r) => setTimeout(r, 1));

    this.serverDataCount = 0;
  }

  async setupObnizPromise(obj, done, options) {
    options = options || {};
    let stub = this.sinon.stub();
    stub.on = this.sinon.stub();
    stub.send = this.sinon.stub();
    stub.close = this.sinon.stub();
    stub.removeAllListeners = this.sinon.stub();
    stub.readyState = 1;

    this.sinon
      .stub(this.Obniz.prototype, '_createCloudSocket')
      .callsFake(() => {
        return stub;
      });
    obj.obnizOptions = options;
    obj.obniz = this.createObniz(100, '12345678', options);
    obj.obniz.error = this.sinon.stub();
    await new Promise((r) => setTimeout(r, 1));
    obj.obniz.wsOnOpen();
    obj.obniz.wsOnMessage(
      JSON.stringify([
        {
          ws: {
            ready: true,
            obniz: {
              firmware: options.__firmware_ver || '2.1.0',
            },
          },
        },
      ])
    );
    this.serverDataCount = 0;

    this.expect(obj.obniz).send([
      { ws: { reset_obniz_on_ws_disconnection: true } },
    ]);
    this.expect(obj.obniz).to.be.finished;

    await new Promise((r) => setTimeout(r, 1));
  }

  async releaseObnizPromise(obj) {
    obj.obniz._close();
    obj.obniz = null;
    this.Obniz.prototype._createCloudSocket.restore();
  }

  closeAndReconnectObnizWait(obj) {
    const options = obj.obnizOptions;
    return new Promise((resolve) => {
      this.serverDataCount = obj.obniz.socket.send.callCount;

      const socet = obj.obniz.socket; // stub
      obj.obniz._close();
      obj.obniz.socket = socet; // stub
      obj.obniz.wsOnOpen();
      obj.obniz.wsOnMessage(
        JSON.stringify([
          {
            ws: {
              ready: true,
              obniz: {
                firmware: options.__firmware_ver || '2.1.0',
              },
            },
          },
        ])
      );

      this.expect(obj.obniz).send([
        { ws: { reset_obniz_on_ws_disconnection: true } },
      ]);
      this.expect(obj.obniz).to.be.finished;
      resolve();
    });
  }

  waitForWebsocketCall(obj, n) {
    return new Promise(function (resolve, reject) {
      let count = 100;
      let wait = function () {
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
  }
  receiveJson(obniz, jsonVal) {
    if (testUtil.isNode()) {
      let validator = require('./obnizJsonValidator');
      let results = validator.responseValidate(jsonVal, 'json');
      require('chai').expect(results.valid, results.errors).to.be.true;
    }

    obniz.wsOnMessage(JSON.stringify(jsonVal));
  }

  isValidCommandRequestJson(jsonVal) {
    if (testUtil.isNode()) {
      let validator = require('./obnizJsonValidator');
      let results = validator.requestValidate(jsonVal, 'wscommand');
      require('chai').expect(results.valid, results.errors).to.be.true;
      return results;
    }

    //browser
    return { valid: true };
  }

  isValidCommandResponseJson(jsonVal) {
    if (testUtil.isNode()) {
      let validator = require('./obnizJsonValidator');
      let results = validator.responseValidate(jsonVal, 'wscommand');
      require('chai').expect(results.valid, results.errors).to.be.true;
      return results;
    }
    //browser
    return { valid: true };
  }

  obnizAssert(_chai, utils) {
    let self = this;
    _chai.Assertion.addProperty('obniz', function () {
      let obj = utils.flag(this, 'object');
      new _chai.Assertion(obj).to.be.instanceof(self.Obniz);
    });

    _chai.Assertion.addMethod('send', function (expected) {
      let count = self.serverDataCount;
      self.serverDataCount++;

      let obniz = utils.flag(this, 'object');
      let stub = obniz.socket.send;

      let message =
        '[obniz.send] no more send data. (called ' +
        stub.callCount +
        ' times, but you expect ' +
        (count + 1) +
        ' times) \n expected data = ' +
        JSON.stringify(expected);
      new _chai.Assertion(stub.callCount, message).to.be.above(count);

      new _chai.Assertion(
        stub.args[count][0],
        '[obniz.send]invalid json'
      ).is.json;
      let val = JSON.parse(stub.args[count][0]);
      if (typeof expected === 'function') {
        let result = expected(val);
        _chai.assert.isOk(result, 'function is not match value');
      } else {
        new _chai.Assertion(val).to.deep.equal(expected);
      }

      if (testUtil.isNode()) {
        let validator = require('./obnizJsonValidator');
        let validateErrors = validator.requestValidate(val, 'json');
        new _chai.Assertion(validateErrors.valid, validateErrors.errors).to.be
          .true;
      }
    });

    _chai.Assertion.addMethod('sendBinary', function (expected) {
      let count = self.serverDataCount;
      self.serverDataCount++;

      let obniz = utils.flag(this, 'object');
      let stub = obniz.socket.send;

      let message =
        '[obniz.send] no more send data. (called ' +
        stub.callCount +
        ' times, but you expect ' +
        (count + 1) +
        ' times) \n expected data = ' +
        JSON.stringify(expected);
      new _chai.Assertion(stub.callCount, message).to.be.above(count);

      new _chai.Assertion(stub.args[count][0]).to.deep.equal(expected);
    });

    _chai.Assertion.addProperty('finished', function (expected) {
      let obniz = utils.flag(this, 'object');
      let stub = obniz.socket.send;
      let message =
        '[obniz.send] not finished. (send: called ' +
        stub.callCount +
        ' times, but you expect ' +
        self.serverDataCount +
        ' times) ';
      new _chai.Assertion(stub.callCount, message).to.be.equal(
        self.serverDataCount
      );

      let errorStub = obniz.error;
      message =
        '[obniz.send] not finished. (error: called ' +
        errorStub.callCount +
        ' times, but you expect ' +
        self.errorDataCount +
        ' times) ';
      new _chai.Assertion(errorStub.callCount, message).to.be.equal(
        self.errorDataCount
      );
    });

    _chai.Assertion.addMethod('error', function (expected) {
      let count = self.errorDataCount;
      self.errorDataCount++;

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

    _chai.Assertion.addProperty('json', function (expected) {
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
  }

  browser(url) {
    if (!this.isNode()) {
      throw new Error('TestUtil.browser only support nodejs');
    }
    url = 'file://' + url;
    let options = {
      url,
      ignoreConsole: true,
    };
    const runner = new this.MochaChrome(options);
    const result = new Promise((resolve, reject) => {
      runner.on('ended', (stats) => {
        resolve(stats);
      });

      runner.on('failure', (message) => {
        reject(message);
      });
    });

    return runner
      .connect()
      .then(function () {
        return runner.run();
      })
      .then(function () {
        return result;
      });
  }

  ejs(url, param) {
    if (!this.isNode()) {
      throw new Error('TestUtil.ejs only support nodejs');
    }
    let data = this.fs.readFileSync(url, 'utf8');
    let html = this.ejsInstance.render(data, param);
    let newFilename =
      this.path.dirname(url) +
      this.path.sep +
      this.path.basename(url).replace('.', '_') +
      '.html';

    return new Promise((resolve, reject) => {
      this.fs.writeFile(newFilename, html, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).then(function () {
      return testUtil.browser(newFilename);
    });
  }

  needBrowserTest() {
    if (
      typeof window === 'undefined' &&
      process &&
      !this.semver.satisfies(process.versions.node, '>=7.6.0')
    ) {
      return false;
    } else if (process && process.env.NO_BROWSER_TEST) {
      return false;
    }
    return true;
  }

  checkJsonToBinary(requestJson, binary, self) {
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
      binary = binary.split(' ').map(function (val, index) {
        return parseInt(val, 16);
      });

      this.expect(binary.length).to.be.above(2);
    }
    binary = new Uint8Array(binary);

    this.expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    this.expect(isValidCommand.valid).to.be.true;

    let compress = self.obniz.constructor.WSCommand.compress(
      self.obniz.wscommands,
      requestJson[0]
    );

    this.expect(compress).to.be.deep.equal(binary);
  }

  checkBinaryToJson(responseBinaryString, expectedJson, self) {
    let binaryArray = responseBinaryString
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    let binary = new Uint8Array(binaryArray);

    let json = self.obniz._binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    this.expect(isValidCommand.valid).to.be.true;

    this.expect(json).to.be.deep.equal(expectedJson);
  }
}

const testUtil = new TestUtil();

if (testUtil.isNode()) {
  module.exports = testUtil;
}
