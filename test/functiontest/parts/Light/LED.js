let chai = require('chai');
let expect = chai.expect;

let testUtil = require('../../testUtil.js');

describe('led', function () {
  beforeEach(async function () {
    await testUtil.setupObnizPromise(this);
  });
  afterEach(async function () {
    await testUtil.releaseObnizPromise(this);
  });

  it('wired', function () {
    this.obniz.wired('LED', { anode: 0, cathode: 1 });

    expect(this.obniz).send([
      {
        io: {
          animation: {
            name: 'Led-0',
            status: 'pause',
          },
        },
      },
    ]);
    expect(this.obniz).send([{ io0: false }]);
    expect(this.obniz).send([{ io1: false }]);
    expect(this.obniz).send([
      {
        display: {
          pin_assign: {
            0: {
              module_name: 'LED',
              pin_name: 'anode',
            },
            1: {
              module_name: 'LED',
              pin_name: 'cathode',
            },
          },
        },
      },
    ]);

    expect(this.obniz).to.be.finished;
  });

  it('wired error', function () {
    expect(() => {
      this.obniz.wired('LED', {});
    }).throws;
    expect(this.obniz).to.be.finished;
  });

  it('wired error2', function () {
    expect(() => {
      this.obniz.wired('LED');
    }).throws;
    expect(this.obniz).to.be.finished;
  });

  it('wired only anode', function () {
    this.obniz.wired('LED', { anode: 10 });

    expect(this.obniz).send([
      {
        io: {
          animation: {
            name: 'Led-10',
            status: 'pause',
          },
        },
      },
    ]);
    expect(this.obniz).send([{ io10: false }]);
    expect(this.obniz).send([
      {
        display: {
          pin_assign: {
            10: {
              module_name: 'LED',
              pin_name: 'anode',
            },
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('on', function () {
    let led = this.obniz.wired('LED', { anode: 0, cathode: 1 });

    expect(this.obniz).send([
      {
        io: {
          animation: {
            name: 'Led-0',
            status: 'pause',
          },
        },
      },
    ]);
    expect(this.obniz).send([{ io0: false }]);
    expect(this.obniz).send([{ io1: false }]);
    expect(this.obniz).send([
      {
        display: {
          pin_assign: {
            0: {
              module_name: 'LED',
              pin_name: 'anode',
            },
            1: {
              module_name: 'LED',
              pin_name: 'cathode',
            },
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;

    led.on();
    expect(this.obniz).send([
      {
        io: {
          animation: {
            name: led.animationName,
            status: 'pause',
          },
        },
      },
    ]);
    expect(this.obniz).send([{ io0: true }]);
    expect(this.obniz).send([{ io1: false }]);
    expect(this.obniz).to.be.finished;

    led.off();
    expect(this.obniz).send([
      {
        io: {
          animation: {
            name: led.animationName,
            status: 'pause',
          },
        },
      },
    ]);
    expect(this.obniz).send([{ io0: false }]);
    expect(this.obniz).send([{ io1: false }]);
    expect(this.obniz).to.be.finished;
  });
});
