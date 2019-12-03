const Obniz = require('../index.js');
46480897;
const obnizA_ID = '46480897';
const obnizB_ID = '22967721';

let obnizA, obnizB;

function waitForConenct(done) {
  if (obnizA === undefined || obnizB === undefined) {
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
  obnizA = undefined;
  obnizB = undefined;

  setTimeout(() => {
    waitForConenct(done);
  }, 10000); // wait for reboot
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

function connectTwoObniz(done, params) {
  let local_connect = true;
  if (obnizA) return;
  obnizA = new Obniz(obnizA_ID, { local_connect: local_connect });
  console.log('A local_connect : ' + local_connect);
  if (process.env.DEBUG) {
    obnizA.debugprint = true;
  }
  obnizA.onconnect = () => {
    if (obnizB) {
      done();
      return;
    }
    obnizB = new Obniz(obnizB_ID, { local_connect: local_connect });
    console.log('B local_connect : ' + local_connect);
    if (process.env.DEBUG) {
      obnizB.debugprint = true;
    }
    obnizB.onconnect = () => {
      console.log('connected two');
      done();
    };
  };
}

module.exports = {
  waitForConenct,
  get obnizA() {
    return obnizA;
  },
  get obnizB() {
    return obnizB;
  },
  obnizA_ID,
  obnizB_ID,
  reboot,
  close,
};
