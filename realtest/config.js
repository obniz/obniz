const Obniz = require('../index.js');

const obnizA_ID = '33761299';
const obnizB_ID = '08714569';

let obnizA, obnizB;

function waitForConenct(done) {
  if (obnizA === undefined || obnizB === undefined) {
    connectTwoObniz(done);
  } else {
    done();
  }
}

function connectTwoObniz(done) {
  if (obnizA) return;
  obnizA = new Obniz(obnizA_ID, { local_connect: true });
  if (process.env.DEBUG) {
    obnizA.debugprint = true;
  }
  obnizA.onconnect = () => {
    obnizB = new Obniz(obnizB_ID, { local_connect: true });
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
};
