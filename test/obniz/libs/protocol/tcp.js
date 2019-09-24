let chai = require('chai');
let expect = chai.expect;

let testUtil = require(global.appRoot + '/test/testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('obniz.libs.tcp', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done);
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('gettcp', function() {
    let tcp = this.obniz.getFreeTcp();

    expect(this.obniz).to.be.finished;
    expect(tcp).to.be.equal(this.obniz.tcp0);
  });

  it('gettcp double', function() {
    let tcp1 = this.obniz.getFreeTcp();
    let tcp2 = this.obniz.getFreeTcp();

    expect(this.obniz).to.be.finished;
    expect(tcp1).to.be.equal(this.obniz.tcp0);
    expect(tcp2).to.be.equal(this.obniz.tcp1);
  });

  it.skip('tcp close', function() {
    this.obniz.tcp0.close();
    expect(this.obniz).send([
      {
        tcp: {
          disconnect: {
            index: 0,
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it.skip('tcp start', function() {
    this.obniz.tcp0.connectWait(80, 'obniz.io');
    expect(this.obniz).send([
      {
        tcp: {
          connect: {
            index: 0,
            port: 80,
            domain: 'obniz.io',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it.skip('tcp number write', function() {
    let tcp1 = this.obniz.getFreeTcp();
    expect(tcp1).to.be.equal(this.obniz.tcp0);
    tcp1.write([0, 1, 2, 3, 4, 5]);
    expect(this.obniz).send([
      {
        tcp: {
          write: {
            index: 0,
            data: [0, 1, 2, 3, 4, 5],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it.skip('tcp text write', function() {
    let tcp1 = this.obniz.getFreeTcp();
    expect(tcp1).to.be.equal(this.obniz.tcp0);
    tcp1.write('hello');
    expect(this.obniz).send([
      {
        tcp: {
          write: {
            index: 0,
            data: [0x68, 0x65, 0x6c, 0x6c, 0x6f],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });
});
