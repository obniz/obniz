'no_html_test_build';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const path = require('path');

const testUtil = require('../testUtil.js');

chai.use(testUtil.obnizAssert.bind(testUtil));

const getPort = require('get-port');

const waitMs = 50;

describe('obniz.index', function () {
  beforeEach(function () {});

  afterEach(function () {});

  it('instance', async function () {
    sinon.stub(console, 'error');
    sinon.stub(console, 'log');
    const obniz = testUtil.createObniz(3000, 'OBNIZ_ID_HERE');
    expect(obniz).to.be.obniz;
    await wait(10);
    sinon.assert.calledOnce(console.error);
    sinon.assert.calledWith(console.error, 'invalid obniz id');
    console.error.restore(); // Unwraps the spy
    console.log.restore(); // Unwraps the spy
  });

  it('connect', function () {
    let port;
    let server;
    let obniz;
    return getPort()
      .then(function (p) {
        port = p;
        server = testUtil.createServer(port);
        // console.log(new Date(), 'use port ' + port);

        const result = new Promise(function (resolve) {
          server.on('connection', function () {
            resolve();
          });
        });

        obniz = testUtil.createObniz(port, '11111111');
        return result;
      })
      .then(function () {
        return wait(waitMs);
      })
      .then(function () {
        expect(obniz).to.be.obniz;
        expect(server.clients.size, 'server connection').to.equal(1);
        obniz.close();
        server.close();
      });
  });

  it('soft_redirect', function () {
    let port;
    let server;
    let port2;
    let server2;
    let obniz;

    return getPort()
      .then(function (p) {
        port = p;
        // console.log(new Date(), 'use port ' + port);
        server = testUtil.createServer(port);
        return getPort();
      })
      .then(function (p2) {
        port2 = p2;
        // console.log(new Date(), 'use port ' + port2);
        server2 = testUtil.createServer(port2);

        const result = new Promise(function (resolve) {
          server.on('connection', function () {
            resolve();
          });
        });

        obniz = testUtil.createObniz(port, '11111111');
        expect(obniz).to.be.obniz;
        return result;
      })
      .then(function () {
        return wait(waitMs);
      })
      .then(function () {
        expect(server.clients.size, 'before server not connected').to.equal(1);
        const result = new Promise(function (resolve) {
          server2.on('connection', function () {
            resolve();
          });
        });

        const val = [{ ws: { redirect: 'ws://localhost:' + port2 } }];

        if (testUtil.isNode()) {
          const validator = require('../obnizJsonValidator');
          const results = validator.responseValidate(val, 'json');
          require('chai').expect(results.valid, results.errors).to.be.true;
        }

        server.clients.values().next().value.send(JSON.stringify(val));

        return result;
      })
      .then(function () {
        return wait(waitMs);
      })
      .then(function () {
        expect(server.clients.size, 'before server remain connection').to.equal(
          0
        );
        expect(server2.clients.size, 'after server not connected').to.equal(1);
        obniz.close();
        server.close();
        server2.close();
      });
  });

  it('browser', function () {
    if (!testUtil.needBrowserTest()) {
      this.skip();
      return;
    }
    this.timeout(200 * 1000);
    let port1;
    let port2;
    let port3;
    let server1;
    let server2;
    let server3;

    return getPort()
      .then(function (p) {
        port1 = p;
        // console.log(new Date(), 'use port ' + port1);
        server1 = testUtil.createServer(port1);
        return getPort();
      })
      .then(function (p) {
        port2 = p;
        // console.log(new Date(), 'use port ' + port2);
        server2 = testUtil.createServer(port2);
        return getPort();
      })
      .then(function (p) {
        port3 = p;
        // console.log(new Date(), 'use port ' + port3);
        server3 = testUtil.createServer(port3);

        server1.on('connection', function () {
          // console.log(new Date(), 'server1 connected');
        });

        server2.on('connection', function () {
          // console.log(new Date(), 'server2 connected');
          setTimeout(function () {
            const val = [{ ws: { redirect: 'ws://localhost:' + port3 } }];
            server2.clients.values().next().value.send(JSON.stringify(val));
          }, 10);
        });

        return;
      })
      .then(function () {
        return testUtil.ejs(path.resolve(__dirname, 'index.ejs'), {
          port1,
          port2,
          port3,
        });
      })
      .then(function (val) {
        expect(val.failures).to.equal(0);
        return wait(waitMs);
      })
      .then(function () {
        server1.close();
        server2.close();
        server3.close();
      });
  });

  it('compress', function () {
    return testUtil
      .setupObnizWait(this, null, { binary: true })
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        this.obniz.io1.output(true);

        return new Promise((resolve) => {
          setTimeout(resolve, 5);
        });
      })
      .then(() => {
        expect(this.obniz).sendBinary(new Uint8Array([2, 0, 2, 1, 1]));
        expect(this.obniz).to.be.finished;

        return testUtil.releaseObnizWait(this);
      })
      .then(function () {
        return Promise.resolve();
      });
  });

  it('onconnect', function () {
    let called = false;
    let called2 = false;
    return testUtil
      .setupNotConnectedYetObnizWait(this)
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        this.obniz.onconnect = function () {
          called = true;
        };
        this.obniz.on('connect', function () {
          called2 = true;
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

        return new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
      })
      .then(() => {
        return testUtil.releaseObnizWait(this);
      })
      .then(() => {
        expect(called).to.be.true;
        expect(called2).to.be.true;
      });
  });

  it('metadata', function () {
    let metadata = null;
    return testUtil
      .setupNotConnectedYetObnizWait(this)
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        this.obniz.onconnect = function (obniz) {
          metadata = obniz.metadata;
        };
        testUtil.receiveJson(this.obniz, [
          {
            ws: {
              ready: true,
              obniz: {
                firmware: '1.0.3',
                metadata: JSON.stringify({ description: 'data' }),
              },
            },
          },
        ]);

        return new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
      })
      .then(() => {
        return testUtil.releaseObnizWait(this);
      })
      .then(() => {
        expect(metadata.description).to.equal('data');
      });
  });

  it('onclose', async () => {
    let called = false;
    let called2 = false;
    await testUtil.setupNotConnectedYetObnizWait(this);

    expect(this.obniz).to.be.obniz;
    expect(this.obniz).to.be.finished; // input queue

    this.obniz.onclose = function () {
      called = true;
    };
    this.obniz.on('close', function () {
      called2 = true;
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
    // connected
    await wait(10);
    expect(called).to.be.false;

    this.obniz.wsOnClose();

    expect(called).to.be.true;
    expect(called2).to.be.true;

    await testUtil.releaseObnizWait(this);
  });

  it('closeWait', async () => {
    await testUtil.setupNotConnectedYetObnizWait(this);

    expect(this.obniz).to.be.obniz;
    expect(this.obniz).to.be.finished; // input queue

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
    // connected
    await wait(10);

    const p = this.obniz.closeWait();

    this.obniz.wsOnClose();

    await p;

    await testUtil.releaseObnizWait(this);
  });

  it('onloop', async () => {
    let called = false;
    await testUtil.setupNotConnectedYetObnizWait(this);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).to.be.finished; // input queue

    this.obniz.onloop = async () => {
      called = true;
    };

    testUtil.connectObniz(this.obniz);
    expect(this.obniz).to.be.finished;

    await wait(10);

    this.obniz.onloop = null;
    await testUtil.releaseObnizWait(this);

    expect(called).to.be.true;
  });

  it('onloop in onconnect', async () => {
    let called = false;
    await testUtil.setupNotConnectedYetObnizWait(this);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).to.be.finished; // input queue

    this.obniz.onconnect = () => {
      this.obniz.onloop = function () {
        called = true;
      };
    };
    expect(this.obniz).to.be.finished;
    testUtil.connectObniz(this.obniz);
    expect(this.obniz).to.be.finished;
    await wait(10);

    this.obniz.onloop = null;
    await testUtil.releaseObnizWait(this);

    expect(called).to.be.true;
  });

  it('double repeat', async () => {
    let called = false;
    let called2 = false;
    await testUtil.setupNotConnectedYetObnizWait(this);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).to.be.finished; // input queue

    // auto pong response
    sinon.stub(this.obniz, 'pingWait').returns(Promise.resolve());

    this.obniz.repeat(function () {
      called = true;
    });

    this.obniz.repeat(function () {
      called2 = true;
    });

    testUtil.connectObniz(this.obniz);
    await wait(10);

    this.obniz.onloop = null;
    await testUtil.releaseObnizWait(this);

    expect(called).to.be.false;
    expect(called2).to.be.true;
  });

  it('double repeat in onconnect', async () => {
    await testUtil.setupNotConnectedYetObnizWait(this);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).to.be.finished; // input queue

    // auto pong response
    sinon.stub(this.obniz, 'pingWait').returns(Promise.resolve());

    let count = 0;
    this.obniz.onconnect = () => {
      this.obniz.repeat(function () {
        count += 100;
      }, 10);

      this.obniz.repeat(function () {
        count++;
      }, 100);
    };

    testUtil.connectObniz(this.obniz);
    await wait(510);

    this.obniz.onloop = null;
    await testUtil.releaseObnizWait(this);

    expect(4 <= count && count <= 6).to.be.true;
  });

  it('connect_repeat', function () {
    let results = true;
    return testUtil
      .setupNotConnectedYetObnizWait(this)
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        let called = false;

        this.obniz.onconnect = function () {
          results = results && called === false;
          called = true;
        };

        this.obniz.repeat(function () {
          results = results && called === true;
          called = true;
        });

        testUtil.connectObniz(this.obniz);

        return new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
      })
      .then(() => {
        this.obniz.onloop = null;
        return testUtil.releaseObnizWait(this);
      })
      .then(() => {
        expect(results).to.be.true;
      });
  });

  it('connect_onloop', function () {
    let results = true;
    return testUtil
      .setupNotConnectedYetObnizWait(this)
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        let called = false;

        this.obniz.onconnect = function () {
          results = results && called === false;
          called = true;
        };

        this.obniz.onloop = function () {
          results = results && called === true;
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

        return new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
      })
      .then(() => {
        this.obniz.onloop = null;
        return testUtil.releaseObnizWait(this);
      })
      .then(() => {
        expect(results).to.be.true;
      });
  });

  it('connectWait', function () {
    let called = false;
    return testUtil
      .setupNotConnectedYetObnizWait(this)
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        this.obniz.connectWait().then((connected) => {
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

        return new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
      })
      .then(() => {
        return testUtil.releaseObnizWait(this);
      })
      .then(() => {
        expect(called).to.be.true;
      });
  });

  it('connectWaitTimeout', function () {
    let called = false;
    return testUtil
      .setupNotConnectedYetObnizWait(this)
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        this.obniz.connectWait({ timeout: 1 }).then((connected) => {
          called = connected === false;
        });

        return new Promise((resolve) => {
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
        return testUtil.releaseObnizWait(this);
      })
      .then(() => {
        expect(called).to.be.true;
      });
  });

  it('reconnect', async () => {
    const port = await getPort();

    // console.log(new Date(), 'get port ' + port);
    const server = testUtil.createServer(port);
    // console.log(new Date(), 'server created');

    let connectionCount = 0;
    server.on('connection', (c) => {
      connectionCount++;
      const val = [
        {
          ws: {
            ready: true,
            obniz: {
              firmware: '1.0.3',
            },
          },
        },
      ];
      c.send(JSON.stringify(val));
    });
    const obniz = testUtil.createObniz(port, '11111111');
    // console.log(new Date(), 'obniz created');
    expect(obniz).to.be.obniz;
    await pollClientNumWait(server, 1);

    expect(server.clients.size, 'before server not connected').to.equal(1);
    expect(connectionCount).to.equal(1);

    // console.log(new Date(), 'server connected');
    await wait(1);

    const onclosePromise = new Promise((resolve) => {
      obniz.onclose = resolve;
    });

    server.clients.values().next().value.close();
    obniz.wsOnClose();
    await onclosePromise;
    // console.log(new Date(), 'server closed', server.clients.size);
    await pollClientNumWait(server, 0);
    // expect(server.clients.size, 'server closed').to.equal(0);
    // console.log(new Date(), 'waiting');
    await pollClientNumWait(server, 1);
    // console.log(new Date(), 'raceds');
    expect(server.clients.size, 'before server not connected').to.equal(1);
    expect(connectionCount).to.equal(2);
    obniz.close();
    server.close();
  }).timeout(20 * 1000);

  it('stop reconnect  when use close', async () => {
    const port = await getPort();
    // console.log(new Date(), 'get port ' + port);
    const server = testUtil.createServer(port);
    // console.log(new Date(), 'server created');

    server.on('connection', (c) => {
      const val = [
        {
          ws: {
            ready: true,
            obniz: {
              firmware: '1.0.3',
            },
          },
        },
      ];
      c.send(JSON.stringify(val));
    });
    const obniz = testUtil.createObniz(port, '11111111');
    // console.log(new Date(), 'obniz created');
    expect(obniz).to.be.obniz;

    await pollClientNumWait(server, 1, 5000);

    expect(server.clients.size, 'before server not connected').to.equal(1);
    // console.log(new Date(), 'server connected');

    await wait(1);

    const onclosePromise = new Promise((resolve) => {
      obniz.onclose = resolve;
    });

    server.clients.values().next().value.close();
    obniz.wsOnClose();
    await wait(100);
    await onclosePromise;
    // console.log(new Date(), 'server closed', obniz.connectionState);
    await obniz.closeWait();
    // console.log(new Date(), 'close Wait');
    await pollClientNumWait(server, 0);
    expect(server.clients.size, 'before server not connected').to.equal(0);
    await pollClientNumWait(server, 1).catch(() => {
      /* allow timeout */
    });
    expect(server.clients.size, 'before server not connected').to.equal(0);
    obniz.close();
    server.close();
  }).timeout(30 * 1000);

  function wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  function pollClientNumWait(server, num, timeout = 1000) {
    return Promise.race([
      new Promise((resolve) => {
        const hop = () => {
          if (server.clients.size === num) {
            resolve();
          } else {
            setTimeout(hop, 1);
          }
        };
        hop();
      }),
      wait(timeout),
    ]);
  }

  async function pingPongWait(obniz) {
    await wait(10);

    let key = [];

    expect(obniz).send((val) => {
      if (
        val[0] &&
        val[0].system &&
        val[0].system.ping &&
        val[0].system.ping.key
      ) {
        key = val[0].system.ping.key;
        return true;
      }
      return false;
    });
    expect(obniz).to.be.finished;
    testUtil.receiveJson(obniz, [
      {
        system: {
          pong: {
            key,
            obnizTime: 1591354603572,
            pingServerTime: 1591354601594,
            pongServerTime: 1591354601771,
          },
        },
      },
    ]);
    await wait(1);
  }
});
