const chai = require('chai');
const expect = chai.expect;
const testUtil = require('../../../testUtil.js');

describe('obniz.libs.io', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this, null, { __firmware_ver: '2.0.0' });
  });

  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('ioAnimation 2_0_0 registrate', function () {
    const obniz = this.obniz;
    this.obniz.io.animation('animation-1', 'registrate', [
      {
        duration: 10,
        state(index) {
          // index = 0
          obniz.io0.output(false);
          obniz.io1.output(true);
        },
      },
      {
        duration: 10,
        state(index) {
          // index = 1
          obniz.io0.output(true);
          obniz.io1.output(false);
        },
      },
    ]);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([
      {
        io: {
          animation: {
            name: 'animation-1',
            states: [
              {
                duration: 10,
                state: [{ io0: false }, { io1: true }],
              },
              {
                duration: 10,
                state: [{ io0: true }, { io1: false }],
              },
            ],
            status: 'registrate',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('ioAnimation 2_0_0 countdown', function () {
    const obniz = this.obniz;
    this.obniz.io.animation(
      'animation-1',
      'loop',
      [
        {
          duration: 10,
          state(index) {
            // index = 0
            obniz.io0.output(false);
            obniz.io1.output(true);
          },
        },
        {
          duration: 10,
          state(index) {
            // index = 1
            obniz.io0.output(true);
            obniz.io1.output(false);
          },
        },
      ],
      100
    );
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([
      {
        io: {
          animation: {
            name: 'animation-1',
            states: [
              {
                duration: 10,
                state: [{ io0: false }, { io1: true }],
              },
              {
                duration: 10,
                state: [{ io0: true }, { io1: false }],
              },
            ],
            status: 'loop',
            repeat: 100,
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });
});
