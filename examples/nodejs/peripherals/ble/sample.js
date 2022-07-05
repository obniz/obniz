// const Obniz = require('obniz');
const Obniz = require('../../../../index.js'); // local
const fetch = require('node-fetch');
const { preProcessFile } = require('typescript');
const { EventEmitter } = require('stream');
const { escapeRegExp } = require('lodash');
const mesh_bu = Obniz.getPartsClass('MESH_100BU');
const mesh_le = Obniz.getPartsClass('MESH_100LE');
const mesh_ac = Obniz.getPartsClass('MESH_100AC');
const mesh_pa = Obniz.getPartsClass('MESH_100PA');
const mesh_th = Obniz.getPartsClass('MESH_100TH');
const mesh_md = Obniz.getPartsClass('MESH_100MD');

const obnizId = '00000000';

const obniz = new Obniz(obnizId, {
  access_token: null,
});

// Connected. 接続完了
obniz.onconnect = async () => {
  console.log(`connected obniz ${obniz.id}`);
  try {
    await obniz.ble.initWait();
    obniz.ble.scan.onfind = async (peripheral) => {
      // sampleBU(peripheral);
      // sampleAC(peripheral);
      // sampleLE(peripheral);
      // samplePA(peripheral);
      sampleTH(peripheral);
      // sampleMD(peripheral);
    };
    await obniz.ble.scan.startWait();
  } catch (e) {
    if (e.name === 'ObnizOfflineError') {
      // just disconnected. waiting for new connection establishment.
    } else {
      console.error(e);
    }
  }
};

// Disconnected. 切断。
obniz.onclose = async () => {
  console.log(`connection lost for obniz ${obniz.id}`);
};

async function sampleBU(peripheral) {
  if (!mesh_bu.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  const BU_block = new mesh_bu(peripheral);
  await BU_block.connectWait();

  let count = 0;
  let goal = 10;

  BU_block.onSinglePressed = (() => {
    ++ count;
    console.log('single pressed, plus 1; current = ' + count);
    if (count === goal) { console.log('YOU ARE WIN !!');}
  });

  BU_block.onDoublePressed = (() => {
    count += 2;
    console.log('double pressed, plus 2; current = ' + count);
    if (count === goal) { console.log('YOU ARE WIN !!');}
  });

  BU_block.onLongPressed = (() => {
    count = 0;
    console.log('long pressed, reset count; current = ' + count);
  });

  BU_block.onBatteryNotify = ((batt) => {
    console.log('battery last : ' + batt + '/10');
  });

  // BU_block.getDataWait();
}

async function sampleLE(peripheral) {
  if (!mesh_le.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  const LED_block = new mesh_le(peripheral);
  await LED_block.connectWait();
  await LED_block.lightup(255, 0, 0, 4000, 256, 256, 1);
}

async function sampleAC(peripheral) {
  if (!mesh_ac.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);

  const AC_block = new mesh_ac(peripheral);
  await AC_block.connectWait();

  AC_block.onTapped = ((accele) => {
    console.log('tapped! (ax, ay, az) = (' + accele.x + ', ' + accele.y + ',' + accele.z + ')');
  });

  AC_block.onShaked = ((accele) => {
    console.log('shaked! (ax, ay, az) = (' + accele.x + ', ' + accele.y + ',' + accele.z + ')');
  });

  AC_block.onFlipped = ((accele) => {
    console.log('flipped! (ax, ay, az) = (' + accele.x + ', ' + accele.y + ',' + accele.z + ')');
  });

  AC_block.onDirection = ((face, accele) => {
    console.log('face ' + face + ', (ax, ay, az) = (' + accele.x + ', ' + accele.y + ',' + accele.z + ')');
  });

  // AC_block.getDataWait();
}

async function samplePA(peripheral) {
  if (!mesh_pa.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  const PA_block = new mesh_pa(peripheral);
  await PA_block.connectWait();

  PA_block.onBatteryNotify = ((batt) => {
    console.log('battery last : ' + batt + '/10');
  });

  let count = 0;
  PA_block.onStatusButtonNotify = (() => {
    ++ count;
    if (count > 9) {
      console.log('status button is pressed 10 times!');
      count = 0;
      return;
    }
    console.log('status button pressed !');
  });

  // PA_block.getDataWait();
}

async function sampleTH(peripheral) {
  if (!mesh_th.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  const TH_block = new mesh_th(peripheral);
  await TH_block.connectWait();
  TH_block.setMode(30, 10, 0, 50, 20, 1, 32);
}

async function sampleMD(peripheral) {
  if (!mesh_md.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  const MD_block = new mesh_md(peripheral);
  await MD_block.connectWait();
  MD_block.setMode(6, 17, 500, 500);
}
