const Obniz = require('../index.js');

//test device
const esp32_ID = '30109815';
//check device
const obnizA_ID = '24658668';
const obnizB_ID = '09643850';

let obnizA, obnizB, esp32;

const mode = {
  digitalRead: 0,
  digitalWrite: 1,
  analogRead: 2,
  analogWrite: 3,
};

const check_io = [
  {
    //default pin (0:pullup,2:pulldown)
    esp32_io: 4,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizA',
    obniz_io: 4,
  },
  {
    esp32_io: 0,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizA',
    obniz_io: 0,
  },
  {
    esp32_io: 2,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizA',
    obniz_io: 1,
  },
  {
    esp32_io: 5,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizA',
    obniz_io: 5,
  },
  {
    esp32_io: 12,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizA',
    obniz_io: 6,
  },
  {
    esp32_io: 13,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizA',
    obniz_io: 7,
  },
  {
    esp32_io: 14,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizA',
    obniz_io: 8,
  },
  {
    esp32_io: 15,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizA',
    obniz_io: 9,
  },
  {
    esp32_io: 16,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizA',
    obniz_io: 10,
  },
  {
    esp32_io: 17,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizA',
    obniz_io: 11,
  },
  {
    esp32_io: 18,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizB',
    obniz_io: 0,
  },
  {
    esp32_io: 19,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizB',
    obniz_io: 1,
  },
  {
    esp32_io: 21,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizB',
    obniz_io: 2,
  },
  {
    esp32_io: 22,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizB',
    obniz_io: 3,
  },
  {
    esp32_io: 23,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizB',
    obniz_io: 4,
  },
  {
    esp32_io: 25,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizB',
    obniz_io: 5,
  },
  {
    esp32_io: 26,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizB',
    obniz_io: 6,
  },
  {
    esp32_io: 27,
    mode: [mode.digitalRead, mode.digitalWrite, mode.analogWrite],
    obniz: 'obnizB',
    obniz_io: 7,
  },
  {
    esp32_io: 32,
    mode: [
      mode.digitalRead,
      mode.digitalWrite,
      mode.analogRead,
      mode.analogWrite,
    ],
    obniz: 'obnizB',
    obniz_io: 8,
  },
  {
    esp32_io: 33,
    mode: [
      mode.digitalRead,
      mode.digitalWrite,
      mode.analogRead,
      mode.analogWrite,
    ],
    obniz: 'obnizB',
    obniz_io: 9,
  },
  {
    esp32_io: 34,
    mode: [mode.digitalRead, mode.analogRead],
    obniz: 'obnizB',
    obniz_io: 10,
  },
  {
    esp32_io: 35,
    mode: [mode.digitalRead, mode.analogRead],
    obniz: 'obnizB',
    obniz_io: 11,
  },
  {
    esp32_io: 36,
    mode: [mode.digitalRead, mode.analogRead],
    obniz: 'obnizA',
    obniz_io: 3,
  },
  {
    esp32_io: 39,
    mode: [mode.digitalRead, mode.analogRead],
    obniz: 'obnizA',
    obniz_io: 2,
  },
];

function waitForConenct(done) {
  if (obnizA === undefined || obnizB === undefined || esp32 === undefined) {
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

  if (esp32 !== undefined) {
    esp32.reboot();
    esp32.close();
  }
  obnizA = undefined;
  obnizB = undefined;
  esp32 = undefined;

  setTimeout(() => {
    waitForConenct(done);
  }, 10000); // wait for reboot
}

function connectTwoObniz(done, params) {
  let local_connect = true;
  esp32 = new Obniz(esp32_ID, { local_connect: local_connect });
  esp32.onconnect = () => {
    if (process.env.DEBUG) {
      esp32.debugprint = true;
    }
    console.log('esp32 local_connect : ' + local_connect);
    if (obnizA) return;
    obnizA = new Obniz(obnizA_ID, { local_connect: local_connect });
    console.log('A local_connect : ' + local_connect);
    if (process.env.DEBUG) {
      obnizA.debugprint = true;
    }
    obnizA.onconnect = () => {
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
  };
}

function getDevice(device) {
  if (device === 'esp32') {
    return esp32;
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
  get esp32() {
    return esp32;
  },
  esp32_ID,
  obnizA_ID,
  obnizB_ID,
  reboot,
  check_io,
  mode,
  getDevice,
};
