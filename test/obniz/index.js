'no_html_test_build';

let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let path = require('path');

let testUtil = require('../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

const getPort = require('get-port');

let waitMs = 50;

describe('obniz.index', function() {
  beforeEach(function() {});

  afterEach(function() {});

  it('instance', function() {
    sinon.stub(console, 'error');
    sinon.stub(console, 'log');
    let obniz = testUtil.createObniz(3000, 'OBNIZ_ID_HERE');
    expect(obniz).to.be.obniz;
    sinon.assert.calledOnce(console.error);
    sinon.assert.calledWith(console.error, 'invalid obniz id');
    console.error.restore(); // Unwraps the spy
    console.log.restore(); // Unwraps the spy
  });

  it('connect', function() {
    let port = undefined;
    let server = undefined;
    let obniz = undefined;
    return getPort()
      .then(function(p) {
        port = p;
        server = testUtil.createServer(port);

        let result = new Promise(function(resolve) {
          server.on('connection', function() {
            resolve();
          });
        });

        obniz = testUtil.createObniz(port, '11111111');
        return result;
      })
      .then(function() {
        return wait(waitMs);
      })
      .then(function() {
        expect(obniz).to.be.obniz;
        expect(server.clients.size, 'server connection').to.equal(1);
        obniz.close();
        server.close();
      });
  });

  it('soft_redirect', function() {
    let port, server, port2, server2, obniz;

    return getPort()
      .then(function(p) {
        port = p;
        server = testUtil.createServer(port);
        return getPort();
      })
      .then(function(p2) {
        port2 = p2;
        server2 = testUtil.createServer(port2);

        let result = new Promise(function(resolve) {
          server.on('connection', function() {
            resolve();
          });
        });

        obniz = testUtil.createObniz(port, '11111111');
        expect(obniz).to.be.obniz;
        return result;
      })
      .then(function() {
        return wait(waitMs);
      })
      .then(function() {
        expect(server.clients.size, 'before server not connected').to.equal(1);
        let result = new Promise(function(resolve) {
          server2.on('connection', function() {
            resolve();
          });
        });

        let val = [{ ws: { redirect: 'ws://localhost:' + port2 } }];

        if (testUtil.isNode()) {
          let validator = require('../obnizJsonValidator');
          let results = validator.responseValidate(val, 'json');
          require('chai').expect(results.valid, results.errors).to.be.true;
        }

        server.clients
          .values()
          .next()
          .value.send(JSON.stringify(val));

        return result;
      })
      .then(function() {
        return wait(waitMs);
      })
      .then(function() {
        expect(server.clients.size, 'before server remain connection').to.equal(
          0
        );
        expect(server2.clients.size, 'after server not connected').to.equal(1);
        obniz.close();
        server.close();
        server2.close();
      });
  });

  if (testUtil.needBrowserTest()) {
    it('browser', function() {
      this.timeout(10000);
      let port1, port2, port3, server1, server2, server3;

      return getPort()
        .then(function(p) {
          port1 = p;
          server1 = testUtil.createServer(port1);
          return getPort();
        })
        .then(function(p) {
          port2 = p;
          server2 = testUtil.createServer(port2);
          return getPort();
        })
        .then(function(p) {
          port3 = p;
          server3 = testUtil.createServer(port3);

          server2.on('connection', function() {
            setTimeout(function() {
              let val = [{ ws: { redirect: 'ws://localhost:' + port3 } }];
              server2.clients
                .values()
                .next()
                .value.send(JSON.stringify(val));
            }, 10);
          });

          return getPort();
        })
        .then(function() {
          return testUtil.ejs(path.resolve(__dirname, 'index.ejs'), {
            port1,
            port2,
            port3,
          });
        })
        .then(function(val) {
          expect(val.failures).to.equal(0);
          return wait(waitMs);
        })
        .then(function() {
          server1.close();
          server2.close();
          server3.close();
        });
    });
  }

  it('compress', function() {
    return new Promise(resolve => {
      testUtil.setupObnizPromise(this, resolve, { binary: true });
    })
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        this.obniz.io1.output(true);

        return new Promise(resolve => {
          setTimeout(resolve, 5);
        });
      })
      .then(() => {
        expect(this.obniz).sendBinary(new Uint8Array([2, 0, 2, 1, 1]));
        expect(this.obniz).to.be.finished;

        return new Promise(resolve => {
          testUtil.releaseObnizePromise(this, resolve);
        });
      })
      .then(function() {
        return Promise.resolve();
      });
  });

  it('onconnect', function() {
    let called = false;
    return new Promise(resolve => {
      testUtil.setupNotConnectedYetObnizPromise(this, resolve);
    })
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        this.obniz.onconnect = function() {
          called = true;
        };
        testUtil.receiveJson(this.obniz, [
          {
            ws: {
              ready: true,
              obniz: {
                firmware: '1.0.3',
              },
            },
          },
        ]);

        return new Promise(resolve => {
          setTimeout(resolve, 500);
        });
      })
      .then(() => {
        return new Promise(resolve => {
          testUtil.releaseObnizePromise(this, resolve);
        });
      })
      .then(() => {
        expect(called).to.be.true;
      });
  });

  it('repeat', function() {
    let called = false;
    return new Promise(resolve => {
      testUtil.setupNotConnectedYetObnizPromise(this, resolve);
    })
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        this.obniz.repeat(function() {
          called = true;
        });
        testUtil.receiveJson(this.obniz, [
          {
            ws: {
              ready: true,
              obniz: {
                firmware: '1.0.3',
              },
            },
          },
        ]);

        return new Promise(resolve => {
          setTimeout(resolve, 500);
        });
      })
      .then(() => {
        return new Promise(resolve => {
          this.obniz.looper = null;
          testUtil.releaseObnizePromise(this, resolve);
        });
      })
      .then(() => {
        expect(called).to.be.true;
      });
  });

  it('connect_repeat', function() {
    let results = true;
    return new Promise(resolve => {
      testUtil.setupNotConnectedYetObnizPromise(this, resolve);
    })
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        let called = false;

        this.obniz.onconnect = function() {
          results = results && called === false;
          called = true;
        };

        this.obniz.repeat(function() {
          results = results && called === true;
          called = true;
        });
        testUtil.receiveJson(this.obniz, [
          {
            ws: {
              ready: true,
              obniz: {
                firmware: '1.0.3',
              },
            },
          },
        ]);

        return new Promise(resolve => {
          setTimeout(resolve, 500);
        });
      })
      .then(() => {
        return new Promise(resolve => {
          this.obniz.looper = null;
          testUtil.releaseObnizePromise(this, resolve);
        });
      })
      .then(() => {
        expect(results).to.be.true;
      });
  });

  it('connectWait', function() {
    let called = false;
    return new Promise(resolve => {
      testUtil.setupNotConnectedYetObnizPromise(this, resolve);
    })
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        this.obniz.connectWait().then(connected => {
          called = connected === true;
        });
        testUtil.receiveJson(this.obniz, [
          {
            ws: {
              ready: true,
              obniz: {
                firmware: '1.0.3',
              },
            },
          },
        ]);

        return new Promise(resolve => {
          setTimeout(resolve, 500);
        });
      })
      .then(() => {
        return new Promise(resolve => {
          testUtil.releaseObnizePromise(this, resolve);
        });
      })
      .then(() => {
        expect(called).to.be.true;
      });
  });

  it('connectWaitTimeout', function() {
    let called = false;
    return new Promise(resolve => {
      testUtil.setupNotConnectedYetObnizPromise(this, resolve);
    })
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        this.obniz.connectWait({ timeout: 1 }).then(connected => {
          called = connected === false;
        });

        return new Promise(resolve => {
          setTimeout(() => {
            testUtil.receiveJson(this.obniz, [
              {
                ws: {
                  ready: true,
                  obniz: {
                    firmware: '1.0.3',
                  },
                },
              },
            ]);
            resolve();
          }, 1500);
        });
      })
      .then(() => {
        return new Promise(resolve => {
          testUtil.releaseObnizePromise(this, resolve);
        });
      })
      .then(() => {
        expect(called).to.be.true;
      });
  });

  function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
});
