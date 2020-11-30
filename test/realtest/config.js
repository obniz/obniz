const Obniz = require('../../index.js');

//TCP Command Test
//Express server used your pc IP Address
const LOCAL_IP = '';

//Select Test Board

let json = require('./board/obniz_1y_check_io.json');

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
} else if (process.env.OBNIZ_DEVICE) {
  throw new Error(`unknown device ${process.env.OBNIZ_DEVICE}`);
}

let checkBoard_ID = process.env.OBNIZ_ID;
if (!checkBoard_ID) {
  //test device
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

const obnizA_ID = process.env.OBNIZA_ID || '54371148';
const obnizB_ID = process.env.OBNIZB_ID || '10803935';

let obnizA, obnizB, checkBoard;
const check_io = json.io;

function waitForConenct(done) {
  if (
    (obnizA === undefined && json.board.some(board => board === 'obnizA')) ||
    (obnizB === undefined && json.board.some(board => board === 'obnizB')) ||
    checkBoard === undefined
  ) {
    connectTwoObniz(done);
  } else {
    done();
  }
}

function reboot(done) {
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
}

function connectTwoObniz(done, params) {
  console.log(json.name + ' Board Test Program');
  let local_connect = true;
  checkBoard = new Obniz(checkBoard_ID, { local_connect: true }); //obniz_server: "ws://stg.obniz.io",obniz_server: "ws://oooo.ngrok.io"
  checkBoard.onconnect = () => {
    if (process.env.DEBUG) {
      checkBoard.debugprint = true;
    }
    console.log('checkBoard local_connect : ' + local_connect);
    if (json.board.some(board => board === 'obnizA')) {
      obnizA = new Obniz(obnizA_ID, { local_connect: local_connect });
      console.log('A local_connect : ' + local_connect);
      if (process.env.DEBUG) {
        obnizA.debugprint = true;
      }
      obnizA.onconnect = () => {
        if (json.board.some(board => board === 'obnizB')) {
          obnizB = new Obniz(obnizB_ID, { local_connect: local_connect });
          console.log('B local_connect : ' + local_connect);
          if (process.env.DEBUG) {
            obnizB.debugprint = true;
          }
          obnizB.onconnect = () => {
            console.log('connected finish');
            done();
          };
        } else {
          console.log('connected finish');
          done();
        }
      };
    } else {
      if (json.board.some(board => board === 'obnizB')) {
        obnizB = new Obniz(obnizB_ID, { local_connect: local_connect });
        console.log('B local_connect : ' + local_connect);
        if (process.env.DEBUG) {
          obnizB.debugprint = true;
        }
        obnizB.onconnect = () => {
          console.log('connected finish');
          done();
        };
      }
    }
  };
}

function getDevice(device) {
  if (device === 'checkBoard') {
    return checkBoard;
  } else if (device === 'obnizB') {
    return obnizB;
  }
  return obnizA;
}

function close(obniz) {
  if (obniz == obnizA) {
    obnizA.close();
    obnizA = undefined;
  } else if (obniz == obnizB) {
    obnizB.close();
    obnizB = undefined;
  }
}

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
