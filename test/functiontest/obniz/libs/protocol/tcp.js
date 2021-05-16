const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const testUtil = require('../../../testUtil.js');

describe('obniz.libs.tcp', function () {
  beforeEach(async function () {
    await testUtil.setupObnizPromise(this);
  });
  afterEach(async function () {
    await testUtil.releaseObnizPromise(this);
  });

  it('gettcp', function () {
    const tcp = this.obniz.getFreeTcp();

    expect(this.obniz).to.be.finished;
    expect(tcp).to.be.equal(this.obniz.tcp0);
  });

  it('gettcp double', function () {
    const tcp1 = this.obniz.getFreeTcp();
    const tcp2 = this.obniz.getFreeTcp();

    expect(this.obniz).to.be.finished;
    expect(tcp1).to.be.equal(this.obniz.tcp0);
    expect(tcp2).to.be.equal(this.obniz.tcp1);
  });

  it('tcp connect', function () {
    this.obniz.tcp2.connectWait(80, 'obniz.io');
    expect(this.obniz).send([
      {
        tcp2: {
          connect: {
            port: 80,
            domain: 'obniz.io',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('tcp close', function () {
    this.obniz.tcp4.used = true;
    this.obniz.tcp4.close();
    expect(this.obniz).send([
      {
        tcp4: {
          disconnect: true,
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
    this.obniz.tcp4.used = false;
  });

  it('tcp number write', function () {
    const tcp1 = this.obniz.getFreeTcp();
    expect(tcp1).to.be.equal(this.obniz.tcp0);
    tcp1.used = true;
    tcp1.write([0, 1, 2, 3, 4, 5]);
    expect(this.obniz).send([
      {
        tcp0: {
          write: {
            data: [0, 1, 2, 3, 4, 5],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
    tcp1.used = false;
  });

  it('tcp text write', function () {
    const tcp1 = this.obniz.getFreeTcp();
    expect(tcp1).to.be.equal(this.obniz.tcp0);
    tcp1.used = true;
    tcp1.write('hello');
    expect(this.obniz).send([
      {
        tcp0: {
          write: {
            data: [0x68, 0x65, 0x6c, 0x6c, 0x6f],
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
    tcp1.used = false;
  });

  it('tcp onreceive', function () {
    const stub = sinon.stub();
    this.obniz.tcp0.used = true;
    this.obniz.tcp0.onreceive = stub;
    const data = [20, 30];
    testUtil.receiveJson(this.obniz, [{ tcp0: { read: { data } } }]);
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args[0]).to.be.deep.equal(data);

    expect(this.obniz).to.be.finished;
    this.obniz.tcp0.used = false;
  });

  it('tcp readWait', function () {
    const data = [20, 30];
    return new Promise(
      function (resolve, reject) {
        this.obniz.tcp0.used = true;
        this.obniz.tcp0.readWait().then((result) => {
          expect(result).to.be.deep.equal(data);
          this.obniz.tcp0.used = false;
          resolve();
        });
        testUtil.receiveJson(this.obniz, [{ tcp0: { read: { data } } }]);
        expect(this.obniz).to.be.finished;
      }.bind(this)
    );
  });
});
