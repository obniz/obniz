const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let checkBoard;
let check_io;

describe('2-io-animation', function () {
  this.timeout(20000 * (config.json.long_timeout || 1));
  before(async function () {
    await config.waitForConenct();
    checkBoard = config.checkBoard;
    check_io = config.check_io.filter((io) =>
      io.mode.some((mode) => mode === 'digitalWrite')
    );
    if (check_io.length === 0) {
      this.skip();
    }
  });

  it('animation', async () => {
    checkBoard.io.animation('animation-1', 'loop', [
      {
        duration: 10,
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        state() {
          checkBoard.getIO(check_io[0].board_io).output(false);
        },
      },
      {
        duration: 10,
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        state() {
          checkBoard.getIO(check_io[0].board_io).output(true);
        },
      },
    ]);
    await checkBoard.pingWait();
    await detectPulse(check_io[0], [40, 60]);
  });

  it('animation pause', async () => {
    checkBoard.io.animation('animation-1', 'pause');
    await checkBoard.pingWait();

    await ioAisBWait(check_io[0], false);
    await ioAisBWait(check_io[0], true);
  });

  it('animation resume', async () => {
    checkBoard.io.animation('animation-1', 'resume');
    await checkBoard.pingWait();
    await detectPulse(check_io[0], [40, 60]);
  });

  it('animation remove', async () => {
    checkBoard.io.animation('animation-1', 'loop');
    await checkBoard.pingWait();

    await ioAisBWait(check_io[0], false);
    await ioAisBWait(check_io[0], true);
  });

  it('two animation', async () => {
    checkBoard.io.animation('animation-1', 'loop', [
      {
        duration: 10,
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        state() {
          checkBoard.getIO(check_io[0].board_io).output(false);
        },
      },
      {
        duration: 10,
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        state() {
          checkBoard.getIO(check_io[0].board_io).output(true);
        },
      },
    ]);
    checkBoard.io.animation('animation-2', 'loop', [
      {
        duration: 10,
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        state() {
          checkBoard.getIO(check_io[1].board_io).output(false);
        },
      },
      {
        duration: 10,
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        state() {
          checkBoard.getIO(check_io[1].board_io).output(true);
        },
      },
    ]);
    await checkBoard.pingWait();
    await detectPulse(check_io[0], [40, 60]);
    await detectPulse(check_io[1], [40, 60]);
    checkBoard.io.animation('animation-1', 'loop');
    checkBoard.io.animation('animation-2', 'loop');
  });
});

const detectPulse = (device, ratioRange) => {
  return new Promise((resolve, reject) => {
    let ignores = 0;
    const obniz = config.getDevice(device.obniz);
    obniz.logicAnalyzer.start({
      io: device.obniz_io,
      interval: 1,
      duration: 300,
    });
    obniz.logicAnalyzer.onmeasured = async (array) => {
      if (ignores > 0) {
        ignores--;
        return;
      }
      const ret = {};
      ret[0] = 0;
      ret[1] = 0;
      for (let i = 0; i < array.length; i++) {
        ret[array[i]]++;
      }
      try {
        expect((ret[1] / (ret[0] + ret[1])) * 100).to.be.within(
          ratioRange[0],
          ratioRange[1]
        ); // check only rate
      } catch (e) {
        reject(e);
      }

      obniz.logicAnalyzer.end();
      await obniz.pingWait();
      resolve();
    };
  });
};

const ioAisBWait = async (device, val, mustbe) => {
  if (mustbe === undefined) {
    mustbe = val;
  }
  checkBoard.getIO(device.board_io).output(val);
  await checkBoard.pingWait();
  const obniz = config.getDevice(device.obniz);
  const valB = await obniz.getIO(device.obniz_io).inputWait();
  expect(valB).to.be.equal(mustbe);
};
