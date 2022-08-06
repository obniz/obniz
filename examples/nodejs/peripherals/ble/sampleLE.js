// const Obniz = require('obniz');
const Obniz = require('../../../../index.js'); // local
const mesh_bu = Obniz.getPartsClass('MESH_100BU');
const MESH_100LE = Obniz.getPartsClass('MESH_100LE');
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


// Disconnected.
obniz.onclose = async () => {
  console.log(`connection lost for obniz ${obniz.id}`);
};

async function sampleLE(peripheral) {
  if (!MESH_100LE.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  const LED_block = new MESH_100LE(peripheral);
  try {
    await LED_block.connectWait();
  } catch (error) {
    console.log(error);
  }
  const _color = {
    red: 15,
    green: 63,
    blue: 0
  };
  const _total_time = 64250; // 4.000 seconds
  const _cycle_on_time = 250; // 0.750 seconds
  const _cycle_off_time = 300; // 0.500 seconds
  // LED_block.setLed(_color, 4000, 255, 255, MESH_100LE.Pattern.BLINK);
  LED_block.setLed(_color, 64250, 255, 256, MESH_100LE.Pattern.FIREFLY);
  // LED_block.setLed(_color, _total_time, _cycle_on_time, _cycle_off_time, MESH_100LE.Pattern.FIREFLY);

  LED_block.onStatusButtonPressed = (()=>{console.log('status button pressed');});

  LED_block.onBatteryLevel = ((batt) => {
    console.log('battery last : ' + batt + '/10');
  });

  const result = await LED_block.getDataWait();
  console.log(result);
}
