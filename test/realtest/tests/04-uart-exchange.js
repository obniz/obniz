const config = require('../config.js');

let checkBoard;
let obnizA;
let check_io;

describe('4-uart-exchange', function () {
  this.timeout(20000);

  before(async function () {
    await config.waitForConenct();
    obnizA = config.obnizA;
    checkBoard = config.checkBoard;
    check_io = config.check_io.filter((io) => io.obniz === 'obnizA');
    if (check_io.length === 0) {
      this.skip();
    }
  });

  afterEach(async () => {
    if (obnizA.uart0 && obnizA.uart0.isUsed()) {
      obnizA.uart0.end();
    }
    if (obnizA.uart1 && obnizA.uart1.isUsed()) {
      obnizA.uart1.end();
    }
    if (checkBoard.uart0 && checkBoard.uart0.isUsed()) {
      checkBoard.uart0.end();
    }
    if (checkBoard.uart1 && checkBoard.uart1.isUsed()) {
      checkBoard.uart1.end();
    }
  });

  it('short string tx rx', async () => {
    const receiver = checkBoard.getFreeUart();
    receiver.start({ tx: check_io[0].board_io, rx: check_io[1].board_io });
    await checkBoard.pingWait();
    const sender = obnizA.getFreeUart();
    sender.start({ tx: check_io[1].obniz_io, rx: check_io[0].obniz_io });

    const text = 'HelloWorld';
    let received = '';
    sender.send(' ');
    await obnizA.pingWait();
    sender.send(text);
    while (1 === 1) {
      if (receiver.isDataExists()) {
        received += receiver.readText();
        if (received.indexOf(text) >= 0) {
          break;
        }
      }
      await wait(1); // wait for 10ms
    }
    receiver.end();
    sender.end();
  });

  it('short utf8 tx rx', async () => {
    const receiver = checkBoard.getFreeUart();
    receiver.start({ tx: check_io[0].board_io, rx: check_io[1].board_io });
    await checkBoard.pingWait();
    const sender = obnizA.getFreeUart();
    sender.start({ tx: check_io[1].obniz_io, rx: check_io[0].obniz_io });

    const text = 'こんにちは'; // eslint-disable-line rulesdir/non-ascii
    let received = '';
    sender.send(' ');
    await obnizA.pingWait();
    sender.send(text);
    while (1) {
      if (receiver.isDataExists()) {
        received += receiver.readText();
        if (received.indexOf(text) >= 0) {
          break;
        }
      }
      await wait(1); // wait for 10ms
    }
    receiver.end();
    sender.end();
  });

  it('long string tx rx 9600', async () => {
    const receiver = checkBoard.getFreeUart();
    receiver.start({
      tx: check_io[0].board_io,
      rx: check_io[1].board_io,
      baud: 9600,
    });
    await checkBoard.pingWait();
    const sender = obnizA.getFreeUart();
    sender.start({
      tx: check_io[1].obniz_io,
      rx: check_io[0].obniz_io,
      baud: 9600,
    });

    let text = '';
    for (let i = 0; i < 4096; i++) {
      text += 'a';
    }
    let received = '';
    sender.send(' ');
    await obnizA.pingWait();
    sender.send(text);
    while (1) {
      if (receiver.isDataExists()) {
        received += receiver.readText();
        if (received.indexOf(text) >= 0) {
          break;
        }
      }
      await wait(1); // wait for 10ms
    }

    receiver.end();
    sender.end();
  });

  it('long string tx rx 115200', async () => {
    const receiver = checkBoard.getFreeUart();
    receiver.start({
      tx: check_io[0].board_io,
      rx: check_io[1].board_io,
      baud: 115200,
    });
    await checkBoard.pingWait();
    const sender = obnizA.getFreeUart();
    sender.start({
      tx: check_io[1].obniz_io,
      rx: check_io[0].obniz_io,
      baud: 115200,
    });

    let text = '';
    for (let i = 0; i < 4096; i++) {
      text += 'a';
    }
    let received = '';
    sender.send(' ');
    await obnizA.pingWait();
    sender.send(text);
    while (1) {
      if (receiver.isDataExists()) {
        received += receiver.readText();
        if (received.indexOf(text) >= 0) {
          break;
        }
      }
      await wait(1); // wait for 10ms
    }

    receiver.end();
    sender.end();
  });

  it('long binary tx rx 115200', async () => {
    const receiver = checkBoard.getFreeUart();
    receiver.start({
      tx: check_io[0].board_io,
      rx: check_io[1].board_io,
      baud: 115200,
    });
    await checkBoard.pingWait();
    const sender = obnizA.getFreeUart();
    sender.start({
      tx: check_io[1].obniz_io,
      rx: check_io[0].obniz_io,
      baud: 115200,
    });

    const data = [];
    for (let i = 0; i < 4096; i++) {
      data.push(i % 256);
    }
    const received = [];
    sender.send(' ');
    await obnizA.pingWait();
    sender.send(data);
    while (1) {
      if (receiver.isDataExists()) {
        received.push(...receiver.readBytes());
        if (received.toString().indexOf(data.toString()) >= 0) {
          break;
        }
      }
      await wait(1); // wait for 10ms
    }

    receiver.end();
    sender.end();
  });

  it('two port at same time', async () => {
    if (!checkBoard.uart1) {
      console.log('skipped');
      return;
    }
    const receiver0 = checkBoard.getFreeUart();
    receiver0.start({
      tx: check_io[0].board_io,
      rx: check_io[1].board_io,
      baud: 9600,
    });
    const receiver1 = checkBoard.getFreeUart();
    receiver1.start({
      tx: check_io[2].board_io,
      rx: check_io[3].board_io,
      baud: 115200,
    });
    await checkBoard.pingWait();
    const sender0 = obnizA.getFreeUart();
    sender0.start({
      tx: check_io[1].obniz_io,
      rx: check_io[0].obniz_io,
      baud: 9600,
    });
    const sender1 = obnizA.getFreeUart();
    sender1.start({
      tx: check_io[3].obniz_io,
      rx: check_io[2].obniz_io,
      baud: 115200,
    });
    await obnizA.pingWait();

    let text0 = '';
    let text1 = '';
    for (let i = 0; i < 1024; i++) {
      text0 += '0';
    }
    for (let i = 0; i < 1024; i++) {
      text1 += '1';
    }

    let received0 = '';
    let received1 = '';
    sender0.send(text0);
    sender1.send(text1);
    let found = 0;
    while (1) {
      if (receiver0.isDataExists()) {
        received0 += receiver0.readText();
        if (received0.indexOf(text0) >= 0) {
          found++;
          received0 = '';
        }
      }
      if (receiver1.isDataExists()) {
        received1 += receiver1.readText();
        if (received1.indexOf(text1) >= 0) {
          found++;
          received1 = '';
        }
      }
      if (found === 2) {
        break;
      }
      await wait(1); // wait for 10ms
    }

    receiver0.end();
    receiver1.end();
    sender0.end();
    sender1.end();
  });
});

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
