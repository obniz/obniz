const Obniz = require('../index.js');

const json = require('./board/esp32devkitc_check_io.json');
//const json = require('./board/m5stickc_check_io.json');
//const json = require('./board/obniz_check_io.json');

//test device
//esp32
const checkBoard_ID = '30109815';
//m5stickc
//const checkBoard_ID = '09130585';
//obniz
//const checkBoard_ID = '09643850';
//check device
const obnizA_ID = '24658668';
const obnizB_ID = '09643850';

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
  checkBoard = new Obniz(checkBoard_ID, { local_connect: local_connect });
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
};
