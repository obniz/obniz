let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');

let testUtil = require(global.appRoot + '/test/testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('obniz.libs.ad', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done);
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('getAD', function() {
    let ad0 = this.obniz.getAD(0);
    expect(ad0.id).to.be.equal(0);

    let ad11 = this.obniz.getAD(11);
    expect(ad11.id).to.be.equal(11);

    expect(function() {
      this.obniz.getAD(12);
    }).to.throw();

    expect(function() {
      this.obniz.getAD('0');
    }).to.throw();

    expect(this.obniz).to.be.finished;
  });

  it('start', function() {
    let stub = sinon.stub();
    this.obniz.ad0.start(stub);

    expect(this.obniz).send([{ ad0: { stream: true } }]);
    expect(this.obniz).to.be.finished;
  });

  it('value', function() {
    let stub = sinon.stub();
    this.obniz.ad0.start(stub);
    expect(this.obniz).send([{ ad0: { stream: true } }]);

    testUtil.receiveJson(this.obniz, [{ ad0: 0 }]);
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args[0]).to.be.equal(0);

    testUtil.receiveJson(this.obniz, [{ ad0: 4.9 }]);
    sinon.assert.callCount(stub, 2);
    expect(stub.getCall(1).args[0]).to.be.equal(4.9);

    expect(this.obniz).to.be.finished;
  });

  it('onchange', function() {
    let stub = sinon.stub();
    this.obniz.ad1.start();
    this.obniz.ad1.onchange = stub;
    expect(this.obniz).send([{ ad1: { stream: true } }]);

    testUtil.receiveJson(this.obniz, [{ ad1: 0 }]);
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args[0]).to.be.equal(0);

    testUtil.receiveJson(this.obniz, [{ ad0: 4.9 }]);
    sinon.assert.callCount(stub, 1);

    expect(this.obniz).to.be.finished;
  });

  it('in var', function() {
    this.obniz.ad1.start();
    expect(this.obniz).send([{ ad1: { stream: true } }]);

    testUtil.receiveJson(this.obniz, [{ ad1: 1 }]);
    expect(this.obniz.ad1.value).to.be.equal(1);

    expect(this.obniz).to.be.finished;
  });

  it('inputWaitTrue', function() {
    return new Promise(
      function(resolve, reject) {
        this.obniz.ad4.getWait().then(function(result) {
          expect(result).to.be.equal(2.6);
          resolve();
        });

        expect(this.obniz).to.be.obniz;
        expect(this.obniz).send([{ ad4: { stream: false } }]);
        expect(this.obniz).to.be.finished;

        setTimeout(
          function() {
            testUtil.receiveJson(this.obniz, [{ ad4: 2.6 }]);
          }.bind(this),
          10
        );
      }.bind(this)
    );
  });

  it('end', function() {
    this.obniz.ad1.start();
    expect(this.obniz).send([{ ad1: { stream: true } }]);

    testUtil.receiveJson(this.obniz, [{ ad1: 1 }]);
    expect(this.obniz.ad1.value).to.be.equal(1);

    this.obniz.ad1.end();
    expect(this.obniz).send([{ ad1: null }]);

    expect(this.obniz).to.be.finished;
  });
});
