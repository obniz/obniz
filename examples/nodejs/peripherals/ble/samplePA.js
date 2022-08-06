// const Obniz = require('obniz');
const Obniz = require('../../../../index.js'); // local

const mesh_pa = Obniz.getPartsClass('MESH_100PA');

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
      samplePA(peripheral);
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

var PA_block = null;
async function samplePA(peripheral) {
  if (!mesh_pa.isMESHblock(peripheral, '1010394')) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  PA_block = new mesh_pa(peripheral);
  await PA_block.connectWait();

  /**
   * Test: Common Event
   */

  // PA_block.onBatteryLevel = ((batt) => {
  //   console.log('battery last : ' + batt + '/10');
  // });

  let count = 0;
  PA_block.onStatusButtonPresse = (() => {
    ++ count;
    if (count > 9) {
      console.log('status button is pressed 10 times!');
      count = 0;
      return;
    }
    console.log('status button pressed !');
  });

  /**
   * Test: Unieq Event
   */

  // Select 'notifyMode' from below ( combinations 16 )
  const _notifyMode = 
    /**
     * select 1 param => combination 7
     */
    // mesh_pa.NotifyMode.STOP;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS;
    // mesh_pa.NotifyMode.UPDATE_PROXIMITY;
    // mesh_pa.NotifyMode.UPDATE_BRIGHTNESS;
    // mesh_pa.NotifyMode.ONCE;
    mesh_pa.NotifyMode.ALWAYS;
    /**
     * select 2 params => combination 15
     */
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.UPDATE_PROXIMITY;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.ONCE;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.ONCE;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS;
    // mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.ONCE;
    // mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONCE;
    // mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.ONCE + mesh_pa.NotifyMode.ALWAYS;
    /**
     * select 3 params => combination 20
     *  */
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.ONCE;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.ONCE;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONCE;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.ONCE + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.ONCE;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONCE;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.ONCE + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONCE;
    // mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.ONCE + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONCE + mesh_pa.NotifyMode.ALWAYS;
    /**
     * select 4 params => combination 15
     */
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.ONCE;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONCE;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.ONCE + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONCE;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.ONCE + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONCE + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONCE;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.ONCE + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONCE + mesh_pa.NotifyMode.ALWAYS;
    // mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONCE + mesh_pa.NotifyMode.ALWAYS;
    /**
     * select 5 params => combination 6
     */
    //  mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONCE;
    //  mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ALWAYS;
    //  mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.ONE + mesh_pa.NotifyMode.ALWAYS;
    //  mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONE + mesh_pa.NotifyMode.ALWAYS;
    //  mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONE + mesh_pa.NotifyMode.ALWAYS;
    //  mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONE + mesh_pa.NotifyMode.ALWAYS;
     /**
      * select 6 params(=all) => combination 1
      */
      // mesh_pa.NotifyMode.EMIT_PROXIMITY + mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.UPDATE_PROXIMITY + mesh_pa.NotifyMode.UPDATE_BRIGHTNESS + mesh_pa.NotifyMode.ONCE + mesh_pa.NotifyMode.ALWAYS;
  
  // Normal
  PA_block.setMode(
     _notifyMode
  );
  // Delay STOP
  // const _delay = 5 * 1000; // ms
  // setTimeout(()=>{
  //   PA_block.setMode(
  //     mesh_pa.NotifyMode.STOP
  //   );
  // }, _delay);

  PA_block.onSensorEvent = ((proximity, brightness) => {
    console.log('Notify: ' + proximity + ', ' + brightness);
  });

  /**
   * Test: get function
   */

  /* Normal */
  // const res = await PA_block.getSensorDataWait();
  // console.log('get: ' + res.proximity + ', ' + res.brightness);
  /* Delay */
  // const _delay = 3 * 1000; // [ms]
  // setTimeout(testGet, _delay);
  /* Repeat */
  const _interval = 1000; // [ms]
  // setInterval(testGet, _interval);
  // setInterval(testGet2, _interval);
}

async function testGet() {
  // const start = Date.now();
  const res = await PA_block.getSensorDataWait().catch(
    (error)=>{
      console.error(error);
      return {proximity: -1, brightness: -1};
    }
  );
  // const end = Date.now();
  // console.log('get: ' + res.proximity + ', ' + res.brightness + '  ' + (end-start) + 'ms');
}

var isReady = true;

async function testGet2() {
  if (!isReady) {
    console.log('------- no send ---------');
    return;
  }
  isReady = false;
  await testGet();
  isReady = true;
}