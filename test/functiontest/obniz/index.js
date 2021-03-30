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
        // console.log(new Date(), 'use port ' + port);

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
        // console.log(new Date(), 'use port ' + port);
        server = testUtil.createServer(port);
        return getPort();
      })
      .then(function(p2) {
        port2 = p2;
        // console.log(new Date(), 'use port ' + port2);
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
      this.timeout(20000);
      let port1, port2, port3, server1, server2, server3;

      return getPort()
        .then(function(p) {
          port1 = p;
          // console.log(new Date(), 'use port ' + port1);
          server1 = testUtil.createServer(port1);
          return getPort();
        })
        .then(function(p) {
          port2 = p;
          // console.log(new Date(), 'use port ' + port2);
          server2 = testUtil.createServer(port2);
          return getPort();
        })
        .then(function(p) {
          port3 = p;
          // console.log(new Date(), 'use port ' + port3);
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

          return;
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
    let called2 = false;
    return new Promise(resolve => {
      testUtil.setupNotConnectedYetObnizPromise(this, resolve);
    })
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        this.obniz.onconnect = function() {
          called = true;
        };
        this.obniz.on('connect', function() {
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

        return new Promise(resolve => {
          setTimeout(resolve, 10);
        });
      })
      .then(() => {
        return new Promise(resolve => {
          testUtil.releaseObnizePromise(this, resolve);
        });
      })
      .then(() => {
        expect(called).to.be.true;
        expect(called2).to.be.true;
      });
  });

  it('metadata', function() {
    let metadata = null;
    return new Promise(resolve => {
      testUtil.setupNotConnectedYetObnizPromise(this, resolve);
    })
      .then(() => {
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).to.be.finished; // input queue

        this.obniz.onconnect = function(obniz) {
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

        return new Promise(resolve => {
          setTimeout(resolve, 10);
        });
      })
      .then(() => {
        return new Promise(resolve => {
          testUtil.releaseObnizePromise(this, resolve);
        });
      })
      .then(() => {
        expect(metadata.description).to.equal('data');
      });
  });

  it('onclose', async () => {
    let called = false;
    let called2 = false;
    await new Promise(resolve => {
      testUtil.setupNotConnectedYetObnizPromise(this, resolve);
    });

    expect(this.obniz).to.be.obniz;
    expect(this.obniz).to.be.finished; // input queue

    this.obniz.onclose = function() {
      called = true;
    };
    this.obniz.on('close', function() {
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
    //connected
    await wait(10);
    expect(called).to.be.false;

    // wsOnClose wrapped by stub
    this.obniz.wsOnClose.wrappedMethod.bind(this.obniz)();

    expect(called).to.be.true;
    expect(called2).to.be.true;

    await new Promise(resolve => {
      testUtil.releaseObnizePromise(this, resolve);
    });
  });

  it('closeWait', async () => {
    await new Promise(resolve => {
      testUtil.setupNotConnectedYetObnizPromise(this, resolve);
    });

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
    //connected
    await wait(10);

    let p = this.obniz.closeWait();

    // wsOnClose wrapped by stub
    this.obniz.wsOnClose.wrappedMethod.bind(this.obniz)();

    await p;

    await new Promise(resolve => {
      testUtil.releaseObnizePromise(this, resolve);
    });
  });

  it('onloop', async () => {
    let called = false;
    await new Promise(resolve => {
      testUtil.setupNotConnectedYetObnizPromise(this, resolve);
    });
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).to.be.finished; // input queue

    this.obniz.onloop = function() {
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

    expect(this.obniz).send([
      {
        ws: {
          reset_obniz_on_ws_disconnection: true,
        },
      },
    ]);

    expect(this.obniz).to.be.finished;
    await pingPongWait(this.obniz);

    await new Promise(resolve => {
      this.obniz.onloop = null;
      testUtil.releaseObnizePromise(this, resolve);
    });

    expect(called).to.be.true;
  });

  it('onloop in onconnect', async () => {
    let called = false;
    await new Promise(resolve => {
      testUtil.setupNotConnectedYetObnizPromise(this, resolve);
    });
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).to.be.finished; // input queue

    this.obniz.onconnect = () => {
      this.obniz.onloop = function() {
        called = true;
      };
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

    expect(this.obniz).send([
      {
        ws: {
          reset_obniz_on_ws_disconnection: true,
        },
      },
    ]);

    expect(this.obniz).to.be.finished;
    await wait(10);
    await pingPongWait(this.obniz);

    await new Promise(resolve => {
      this.obniz.onloop = null;
      testUtil.releaseObnizePromise(this, resolve);
    });

    expect(called).to.be.true;
  });

  it('double repeat', async () => {
    let called = false;
    let called2 = false;
    await new Promise(resolve => {
      testUtil.setupNotConnectedYetObnizPromise(this, resolve);
    });
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).to.be.finished; // input queue

    // auto pong response
    sinon.stub(this.obniz, 'pingWait').returns(Promise.resolve());

    this.obniz.repeat(function() {
      called = true;
    });

    this.obniz.repeat(function() {
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

    expect(this.obniz).send([
      {
        ws: {
          reset_obniz_on_ws_disconnection: true,
        },
      },
    ]);

    await wait(10);

    await new Promise(resolve => {
      this.obniz.onloop = null;
      testUtil.releaseObnizePromise(this, resolve);
    });

    expect(called).to.be.false;
    expect(called2).to.be.true;
  });

  it('double repeat in onconnect', async () => {
    await new Promise(resolve => {
      testUtil.setupNotConnectedYetObnizPromise(this, resolve);
    });

    expect(this.obniz).to.be.obniz;
    expect(this.obniz).to.be.finished; // input queue

    // auto pong response
    sinon.stub(this.obniz, 'pingWait').returns(Promise.resolve());

    let count = 0;
    this.obniz.onconnect = () => {
      this.obniz.repeat(function() {
        count += 100;
      }, 10);

      this.obniz.repeat(function() {
        count++;
      }, 100);
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

    expect(this.obniz).send([
      {
        ws: {
          reset_obniz_on_ws_disconnection: true,
        },
      },
    ]);

    await wait(510);

    await new Promise(resolve => {
      this.obniz.onloop = null;
      testUtil.releaseObnizePromise(this, resolve);
    });

    expect(4 <= count && count <= 6).to.be.true;
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
          this.obniz.onloop = null;
          testUtil.releaseObnizePromise(this, resolve);
        });
      })
      .then(() => {
        expect(results).to.be.true;
      });
  });

  it('connect_onloop', function() {
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

        this.obniz.onloop = function() {
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

        return new Promise(resolve => {
          setTimeout(resolve, 500);
        });
      })
      .then(() => {
        return new Promise(resolve => {
          this.obniz.onloop = null;
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

  it('reconnect', async () => {
    const port = await getPort();

    // console.log(new Date(), 'get port ' + port);
    const server = testUtil.createServer(port);
    // console.log(new Date(), 'server created');

    server.on('connection', c => {
      let val = [
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
    await wait(waitMs * 3);

    expect(server.clients.size, 'before server not connected').to.equal(1);

    // console.log(new Date(), 'server connected');
    await wait(1);

    let onclosePromise = new Promise(resolve => {
      obniz.onclose = resolve;
    });

    server.clients
      .values()
      .next()
      .value.close();
    // wsOnClose wrapped by stub
    obniz.wsOnClose.wrappedMethod.bind(obniz)();
    await wait(100);
    await onclosePromise;
    // console.log(new Date(), 'server closed');
    expect(server.clients.size, 'before server not connected').to.equal(0);
    // console.log(new Date(), 'waiting');
    await Promise.race([
      wait(5 * 1000),
      new Promise(async resolve => {
        while (1) {
          if (server.clients.size === 1) {
            resolve();
          }
          await wait(1);
        }
      }),
    ]);
    // console.log(new Date(), 'raceds');
    expect(server.clients.size, 'before server not connected').to.equal(1);
    obniz.close();
    server.close();
  }).timeout(20 * 1000);

  it('stop reconnect  when use close', async () => {
    const port = await getPort();
    // console.log(new Date(), 'get port ' + port);
    const server = testUtil.createServer(port);
    // console.log(new Date(), 'server created');

    server.on('connection', c => {
      let val = [
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

    await wait(waitMs * 3);

    expect(server.clients.size, 'before server not connected').to.equal(1);
    // console.log(new Date(), 'server connected');

    await wait(1);

    let onclosePromise = new Promise(resolve => {
      obniz.onclose = resolve;
    });

    server.clients
      .values()
      .next()
      .value.close();
    // wsOnClose wrapped by stub
    obniz.wsOnClose.wrappedMethod.bind(obniz)();
    await wait(100);
    await onclosePromise;
    // console.log(new Date(), 'server closed');
    await obniz.closeWait();

    expect(server.clients.size, 'before server not connected').to.equal(0);
    await Promise.race([
      wait(5 * 1000),
      new Promise(async resolve => {
        while (1) {
          if (server.clients.size === 1) {
            resolve();
          }
          await wait(1);
        }
      }),
    ]);
    expect(server.clients.size, 'before server not connected').to.equal(0);
    obniz.close();
    server.close();
  }).timeout(20 * 1000);

  function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  async function pingPongWait(obniz) {
    await wait(10);

    let key = [];

    expect(obniz).send(val => {
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
            key: key,
            obnizTime: 1591354603572,
            pingServerTime: 1591354601594,
            pongServerTime: 1591354601771,
          },
        },
      },
    ]);
    await wait(10);
  }
});
