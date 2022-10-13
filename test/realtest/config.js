const Obniz = require('../../index.js');

// TCP Command Test
// Express server used your pc IP Address
const LOCAL_IP = '';

// Select Test Board

let json = require('./board/obniz_1y_check_io.json');
json = require('./board/blewifi_gw.json');

if (process.env.OBNIZ_DEVICE === 'devkitc') {
  json = require('./board/esp32devkitc_check_io.json');
} else if (process.env.OBNIZ_DEVICE === 'stickc') {
  json = require('./board/m5stickc_check_io.json');
} else if (process.env.OBNIZ_DEVICE === 'board') {
  json = require('./board/obniz_check_io.json');
} else if (process.env.OBNIZ_DEVICE === 'board1y') {
  json = require('./board/obniz_1y_check_io.json');
} else if (process.env.OBNIZ_DEVICE === 'lte') {
  json = require('./board/esp32lte_check_io.json');
} else if (process.env.OBNIZ_DEVICE === 'pico') {
  json = require('./board/esp32pikokitv4_check_io.json');
} else if (process.env.OBNIZ_DEVICE === 'stack') {
  json = require('./board/m5stackbasic_check_io.json');
} else if (process.env.OBNIZ_DEVICE === 'devkitm') {
  json = require('./board/esp32c3devkitm_check_io.json');
} else if (process.env.OBNIZ_DEVICE === 'blewifi_gw') {
  json = require('./board/blewifi_gw.json');
} else if (process.env.OBNIZ_DEVICE === 'blewifi_gw2') {
  json = require('./board/blewifi_gw2.json');
} else if (process.env.OBNIZ_DEVICE) {
  throw new Error(`unknown device ${process.env.OBNIZ_DEVICE}`);
}

let checkBoard_ID = process.env.OBNIZ_ID || '54848278';
if (!checkBoard_ID) {
  // test device
  if (json.name === 'ESP32 Dev Kit') {
    checkBoard_ID = '32106175';
  } else if (json.name === 'M5STICK C') {
    checkBoard_ID = '88801217';
  } else if (json.name === 'obniz board') {
    checkBoard_ID = '50662155';
  } else if (json.name === 'obniz 1Y') {
    checkBoard_ID = '63370966';
  } else if (json.name === 'ESP32 Pico Kit v4') {
    checkBoard_ID = '05094470';
  } else if (json.name === 'ESP32 LTE') {
    checkBoard_ID = '41232281';
  } else if (json.name === 'M5Stack Basicv') {
    checkBoard_ID = '41232281';
  }
}

const obnizA_ID = process.env.OBNIZA_ID || '16985860';
const obnizB_ID = process.env.OBNIZB_ID || '10803935';

let obnizA;
let obnizB;
let checkBoard;
const check_io = json.io;

const waitForConenct = (done) => {
  if (
    (obnizA === undefined && json.board.some((board) => board === 'obnizA')) ||
    (obnizB === undefined && json.board.some((board) => board === 'obnizB')) ||
    checkBoard === undefined
  ) {
    connectTwoObniz(done);
  } else {
    done();
  }
};

const reboot = (done) => {
  if (obnizA !== undefined) {
    obnizA.reboot();
    obnizA.close();
  }

  if (obnizB !== undefined) {
    obnizB.reboot();
    obnizB.close();
  }

  if (checkBoard !== undefined) {
    checkBoard.reboot();
    checkBoard.close();
  }
  obnizA = undefined;
  obnizB = undefined;
  checkBoard = undefined;

  setTimeout(() => {
    waitForConenct(done);
  }, 10000); // wait for reboot
};

// eslint-disable-next-line no-unused-vars
const connectTwoObniz = (done, params) => {
  const local_connect = process.env.LOCAL_CONNECT === 'false' ? false : true;
  checkBoard = new Obniz(checkBoard_ID, { local_connect }); // obniz_server: "ws://stg.obniz.io",obniz_server: "ws://oooo.ngrok.io"
  checkBoard.onconnect = () => {
    if (process.env.DEBUG) {
      checkBoard.debugprint = true;
      console.log(checkBoard);
    }
    if (json.board.some((board) => board === 'obnizA')) {
      obnizA = new Obniz(obnizA_ID, { local_connect });
      if (process.env.DEBUG) {
        obnizA.debugprint = true;
      }
      obnizA.onconnect = () => {
        if (json.board.some((board) => board === 'obnizB')) {
          obnizB = new Obniz(obnizB_ID, { local_connect });
          if (process.env.DEBUG) {
            obnizB.debugprint = true;
          }
          obnizB.onconnect = () => {
            done();
          };
          obnizB.onerror = (obniz, error) => {
            console.error(obnizB_ID, error.message);
          };
        } else {
          done();
        }
      };
      obnizA.onerror = (obniz, error) => {
        console.error(obnizA_ID, error.message);
      };
    } else {
      if (json.board.some((board) => board === 'obnizB')) {
        obnizB = new Obniz(obnizB_ID, { local_connect });
        if (process.env.DEBUG) {
          obnizB.debugprint = true;
        }
        obnizB.onconnect = () => {
          done();
        };
        obnizB.onerror = (obniz, error) => {
          console.error(obnizB_ID, error.message);
        };
      }
    }
  };
};

const getDevice = (device) => {
  if (device === 'checkBoard') {
    return checkBoard;
  } else if (device === 'obnizB') {
    return obnizB;
  }
  return obnizA;
};

const close = (obniz) => {
  if (obniz === obnizA) {
    obnizA.close();
    obnizA = undefined;
  } else if (obniz === obnizB) {
    obnizB.close();
    obnizB = undefined;
  }
};

module.exports = {
  waitForConenct,
  get obnizA() {
    return obnizA;
  },
  get obnizB() {
    return obnizB;
  },
  get checkBoard() {
    return checkBoard;
  },
  checkBoard_ID,
  obnizA_ID,
  obnizB_ID,
  reboot,
  check_io,
  getDevice,
  LOCAL_IP,
  json,
  close,
};
