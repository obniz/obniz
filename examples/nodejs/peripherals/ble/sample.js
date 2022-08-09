// const Obniz = require('obniz');
const Obniz = require('../../../../index.js'); // local
const mesh_bu = Obniz.getPartsClass('MESH_100BU');
const mesh_ac = Obniz.getPartsClass('MESH_100AC');

const obnizId = '87287267';

const obniz = new Obniz(obnizId, {
  access_token: null,
});

// Connected.
obniz.onconnect = async () => {
  console.log(`connected obniz ${obniz.id}`);
  try {
    await obniz.ble.initWait();
    obniz.ble.scan.onfind = async (peripheral) => {
      // sampleBU(peripheral);
      sampleAC(peripheral);
    };
    await obniz.ble.scan.startWait();
    // await continueScan(obniz);
  } catch (e) {
    if (e.name === 'ObnizOfflineError') {
      // just disconnected. waiting for new connection establishment.
    } else {
      console.error(e);
    }
  }
};

async function continueScan(obniz) {
  while (obniz.connectionState === 'connected') {
    const founded = await scanFor(obniz, 10);
  }
}

count = 0;
sum = 0;
async function scanFor(obniz, seconds) {
  return await new Promise(async (resolve, reject) =>{
    obniz.ble.scan.onfind = async peripheral => {
      const name = peripheral.localName;
      if (!name) {
        return;
      }
      if (name.indexOf('MESH-100BU') !== 0) {
        return;
      }
      sum += peripheral.rssi;
      count ++;
      console.log(name + ' : ' + peripheral.rssi + ' : ave ' + (sum/count));
    };
    obniz.ble.scan.onfinish = async (peripheral, error) => {
      console.log('end');
    };
    try {
      await obniz.ble.scan.startAllWait(null,{
        duplicate:true,
        duration: seconds,
        activeScan:true,
        filterOnDevice:false,
      });
    } catch(e) {
      console.error(e);
      obniz.reboot();
    }
  });
}

// Disconnected.
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
  const goal = 10;

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

async function sampleAC(peripheral) {
  if (!mesh_ac.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);

  const AC_block = new mesh_ac(peripheral);
  await AC_block.connectWait();
  // AC_block.setMode(3,0,15);

  AC_block.onTapped = ((accele) => {
    console.log('tapped! (ax, ay, az) = (' + accele.x + ', ' + accele.y + ',' + accele.z + ')');
  });

  AC_block.onShaked = ((accele) => {
    console.log('shaked! (ax, ay, az) = (' + accele.x + ', ' + accele.y + ',' + accele.z + ')');
  });

  AC_block.onFlipped = ((accele) => {
    console.log('flipped! (ax, ay, az) = (' + accele.x + ', ' + accele.y + ',' + accele.z + ')');
  });

  AC_block.onOrientationChanged = ((face, accele) => {
    console.log('orientation ' + face + ', (ax, ay, az) = (' + accele.x + ', ' + accele.y + ',' + accele.z + ')');
  });

  // AC_block.getDataWait();
}
