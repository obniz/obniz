const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const testUtil = require('../../../testUtil.js');

describe('obniz.libs.logicanalyser', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this);
  });
  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('start', function () {
    this.obniz.logicAnalyzer.start({ io: 1, interval: 0.1, duration: 100 });

    expect(this.obniz).send([
      { logic_analyzer: { interval: 0.1, io: [1], duration: 100 } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('startWithTrigger', function () {
    this.obniz.logicAnalyzer.start({
      io: 1,
      interval: 0.1,
      duration: 100,
      triggerValue: false,
      triggerValueSamples: 3,
    });

    expect(this.obniz).send([
      {
        logic_analyzer: {
          interval: 0.1,
          io: [1],
          duration: 100,
          trigger: { samples: 3, value: false },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });
  it('startWithTrigger2', function () {
    this.obniz.logicAnalyzer.start({
      io: 1,
      interval: 0.1,
      duration: 100,
      triggerValue: 1,
      triggerValueSamples: 3,
    });

    expect(this.obniz).send([
      {
        logic_analyzer: {
          interval: 0.1,
          io: [1],
          duration: 100,
          trigger: { samples: 3, value: true },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('onmeasured', function () {
    const stub = sinon.stub();
    this.obniz.logicAnalyzer.start({
      io: 1,
      interval: 0.1,
      duration: 100,
      triggerValue: false,
      triggerValueSamples: 3,
    });

    expect(this.obniz).send([
      {
        logic_analyzer: {
          interval: 0.1,
          io: [1],
          duration: 100,
          trigger: { samples: 3, value: false },
        },
      },
    ]);
    this.obniz.logicAnalyzer.onmeasured = stub;
    const data = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
      1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
      0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
      0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
      1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
    ];
    testUtil.receiveJson(this.obniz, [{ logic_analyzer: { data } }]);

    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args[0]).to.be.deep.equal(data);

    expect(this.obniz).to.be.finished;
  });

  it('onmeasured need pin no');

  it('finished', function () {
    this.obniz.logicAnalyzer.start({ io: 1, interval: 0.1, duration: 100 });

    expect(this.obniz).send([
      { logic_analyzer: { interval: 0.1, io: [1], duration: 100 } },
    ]);
    expect(this.obniz).to.be.finished;

    this.obniz.logicAnalyzer.end();
    expect(this.obniz).send([{ logic_analyzer: null }]);
  });
});
