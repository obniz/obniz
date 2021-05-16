const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const testUtil = require('../../../testUtil.js');

describe('obniz.libs.measure', function () {
  beforeEach(async function () {
    await testUtil.setupObnizPromise(this);
  });
  afterEach(async function () {
    await testUtil.releaseObnizPromise(this);
  });

  it('echo', function () {
    this.obniz.measure.echo({
      io_pulse: 1, // io for generate pulse
      io_echo: 2, // io to be measured
      pulse: 'positive', // generate pulse pattern
      pulse_width: 0.1, // generate pulse width
      measure_edges: 3, // 1 to 4. maximum edges to measure
      timeout: 1000, // this is optional. 1000(1sec) is default
    });

    expect(this.obniz).send([
      {
        measure: {
          echo: {
            io_pulse: 1,
            io_echo: 2,
            pulse: 'positive',
            pulse_width: 0.1,
            measure_edges: 3,
            timeout: 1000,
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('echo response', function () {
    const stub = sinon.stub();
    this.obniz.measure.echo({
      io_pulse: 1, // io for generate pulse
      io_echo: 2, // io to be measured
      pulse: 'positive', // generate pulse pattern
      pulse_width: 0.1, // generate pulse width
      measure_edges: 3, // 1 to 4. maximum edges to measure
      timeout: 1000, // this is optional. 1000(1sec) is default
      callback: stub,
    });

    expect(this.obniz).send([
      {
        measure: {
          echo: {
            io_pulse: 1,
            io_echo: 2,
            pulse: 'positive',
            pulse_width: 0.1,
            measure_edges: 3,
            timeout: 1000,
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;

    testUtil.receiveJson(this.obniz, [
      {
        measure: {
          echo: [
            {
              edge: true,
              timing: 500,
            },
          ],
        },
      },
    ]);

    expect(stub.getCall(0).args.length).to.be.equal(1);
    expect(stub.getCall(0).args[0]).to.be.deep.equal([
      {
        edge: true,
        timing: 500,
      },
    ]);
  });
});
