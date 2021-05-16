const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const testUtil = require('../../../testUtil.js');

describe('obniz.libs.switch', function () {
  beforeEach(async function () {
    await testUtil.setupObnizPromise(this);
  });
  afterEach(async function () {
    await testUtil.releaseObnizPromise(this);
  });

  it('onchange', function () {
    const stub = sinon.stub();
    this.obniz.switch.onchange = stub;
    expect(this.obniz).to.be.obniz;
    sinon.assert.callCount(stub, 0);

    testUtil.receiveJson(this.obniz, [{ switch: { state: 'none' } }]);

    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args[0]).to.be.equal('none');

    expect(this.obniz).to.be.finished;
  });

  it.skip('not value changd  , but it detect action:get on onchange func', function () {
    const stub = sinon.stub();
    this.obniz.switch.onchange = stub;
    expect(this.obniz).to.be.obniz;
    sinon.assert.callCount(stub, 0);

    testUtil.receiveJson(this.obniz, [
      { switch: { state: 'push', action: 'get' } },
    ]);

    sinon.assert.callCount(stub, 0);

    expect(this.obniz).to.be.finished;
  });

  it('inputWaitLeft', function () {
    return new Promise(
      function (resolve, reject) {
        this.obniz.switch.getWait().then(function (result) {
          expect(result).to.be.equal('left');
          resolve();
        });

        expect(this.obniz).to.be.obniz;
        expect(this.obniz).send([{ switch: 'get' }]);
        expect(this.obniz).to.be.finished;

        setTimeout(
          function () {
            testUtil.receiveJson(this.obniz, [
              { switch: { state: 'left', action: 'get' } },
            ]);
          }.bind(this),
          10
        );
      }.bind(this)
    );
  });

  it('stateWait', function () {
    let before = true;
    return new Promise(
      function (resolve, reject) {
        this.obniz.switch.stateWait('push').then(function (result) {
          expect(before).to.be.false;
          resolve();
        });

        expect(this.obniz).to.be.obniz;
        testUtil.receiveJson(this.obniz, [{ switch: { state: 'left' } }]);
        expect(this.obniz).to.be.finished;

        testUtil.receiveJson(this.obniz, [{ switch: { state: 'right' } }]);
        expect(this.obniz).to.be.finished;

        setTimeout(
          function () {
            before = false;
            testUtil.receiveJson(this.obniz, [{ switch: { state: 'push' } }]);
          }.bind(this),
          10
        );
      }.bind(this)
    );
  });
});
