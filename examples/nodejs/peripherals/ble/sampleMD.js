// const Obniz = require('obniz');
const Obniz = require('../../../../index.js'); // local
const fetch = require('node-fetch');
const mesh_md = Obniz.getPartsClass('MESH_100MD');

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
      sampleMD(peripheral);
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

var MD_block = null;
async function sampleMD(peripheral) {
  if (!mesh_md.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  MD_block = new mesh_md(peripheral);
  await MD_block.connectWait();

  const _notifyMode =
    /**
     * select 1 param => combination 4
     */
    // mesh_md.NotifyMode.DETECTED;
    // mesh_md.NotifyMode.NOT_DETECTED;
    // mesh_md.NotifyMode.ONCE;
    mesh_md.NotifyMode.ALWAYS;
    /**
     * select 2 params => combination 6
     */
    // mesh_md.NotifyMode.DETECTED + mesh_md.NotifyMode.NOT_DETECTED;
    // mesh_md.NotifyMode.DETECTED + mesh_md.NotifyMode.ONCE;
    // mesh_md.NotifyMode.DETECTED + mesh_md.NotifyMode.ALWAYS;
    // mesh_md.NotifyMode.NOT_DETECTED + mesh_md.NotifyMode.ONCE;
    // mesh_md.NotifyMode.NOT_DETECTED + mesh_md.NotifyMode.ALWAYS;
    // mesh_md.NotifyMode.ONCE + mesh_md.NotifyMode.ALWAYS;
    /**
     * select 3 params => combination 4
     */
    // mesh_md.NotifyMode.DETECTED + mesh_md.NotifyMode.NOT_DETECTED + mesh_md.NotifyMode.ONCE;
    // mesh_md.NotifyMode.DETECTED + mesh_md.NotifyMode.NOT_DETECTED + mesh_md.NotifyMode.ALWAYS;
    // mesh_md.NotifyMode.DETECTED + mesh_md.NotifyMode.ONCE + mesh_md.NotifyMode.ALWAYS;
    // mesh_md.NotifyMode.NOT_DETECTED + mesh_md.NotifyMode.ONCE + mesh_md.NotifyMode.ALWAYS;
    /**
     * select 4 params(=all) => combination 1
     */
    // mesh_md.NotifyMode.DETECTED + mesh_md.NotifyMode.NOT_DETECTED + mesh_md.NotifyMode.ONCE + mesh_md.NotifyMode.ALWAYS;

  // MD_block.setMode(_notifyMode, 500, 500);
  // MD_block.onSensorEvent = ((motionState, notifyMode) => {
  //   console.log(motionState, notifyMode);
  // });

  setInterval(getDataMD, 2000);
}

async function getDataMD() {
  const motionState = await MD_block.getSensorDataWait();
  switch (motionState) {
    case mesh_md.MotionState.DETECTED: {
      console.log('Detected !');
      break;
    }
    case mesh_md.MotionState.NOT_DETECTED: {
      console.log('Not Detected.');
      break;
    }
    default: {
      console.log('During Startup...');
      break;
    }
  }
}
