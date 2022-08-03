// const Obniz = require('obniz');
const Obniz = require('../../../../index.js'); // local
const mesh_bu = Obniz.getPartsClass('MESH_100BU');
const MESH_100LE = Obniz.getPartsClass('MESH_100LE');
const mesh_ac = Obniz.getPartsClass('MESH_100AC');

const obnizId = '00000000';

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
      // sampleAC(peripheral);
      sampleLE(peripheral);
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
  if (!MESH_100LE.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  const LED_block = new MESH_100LE(peripheral);
  await LED_block.connectWait();

  const _red = 63;
  const _green = 127;
  const _blue = 31;
  const _total_time = 4000; // 4.000 seconds
  const _cycle_on_time = 750; // 0.750 seconds
  const _cycle_off_time = 500; // 0.500 seconds
  LED_block.lightup(_red, _green, _blue, _total_time, _cycle_on_time, _cycle_off_time, MESH_100LE.Pattern.FIREFLY);

  LED_block.onStatusButtonNotify = (()=>{console.log('status button pressed');});

  const result = await LED_block.getDataWait();
  console.log(result.battery);
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

  AC_block.onDirection = ((face, accele) => {
    console.log('face ' + face + ', (ax, ay, az) = (' + accele.x + ', ' + accele.y + ',' + accele.z + ')');
  });

  // AC_block.getDataWait();
}
