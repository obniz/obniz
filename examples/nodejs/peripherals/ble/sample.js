// const Obniz = require('obniz');
const Obniz = require('../../../../index.js'); // local
const fetch = require('node-fetch');
const mesh_bu = Obniz.getPartsClass('MESH_100BU');
const MESH_100LE = Obniz.getPartsClass('MESH_100LE');
const mesh_ac = Obniz.getPartsClass('MESH_100AC');
const mesh_pa = Obniz.getPartsClass('MESH_100PA');
const mesh_th = Obniz.getPartsClass('MESH_100TH');
const mesh_md = Obniz.getPartsClass('MESH_100MD');
const mesh_gp = Obniz.getPartsClass('MESH_100GP');

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
      // sampleLE(peripheral);
      samplePA(peripheral);
      // sampleTH(peripheral);
      // sampleMD(peripheral);
      // sampleGP(peripheral);
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
  const _cycle_on_time = 1000; // 0.500 seconds
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

var PA_block = null;
async function samplePA(peripheral) {
  if (!mesh_pa.sameSerialNumberBlock(peripheral, '1010394')) {
  // if (!mesh_pa.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  PA_block = new mesh_pa(peripheral);
  await PA_block.connectWait();

  /**
   * Test: Common Event
   */

  PA_block.onBatteryLevel = ((batt) => {
    console.log('battery last : ' + batt + '/10');
  });

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
    // mesh_pa.NotifyMode.ALWAYS;
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
    mesh_pa.NotifyMode.EMIT_BRIGHTNESS + mesh_pa.NotifyMode.ONCE + mesh_pa.NotifyMode.ALWAYS;
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
  
  const _proximityRangeUpper = 30;
  const _proximityRangeBottom = 0;
  const _brightnessRangeUpper = 255;
  const _brightnessRangeBottom = 0;
  // Normal
  PA_block.setMode(
    _proximityRangeUpper,
    _proximityRangeBottom,
    _brightnessRangeUpper,
    _brightnessRangeBottom,
    _notifyMode
  );
  // Delay STOP
  // const _delay = 5 * 1000; // ms
  // setTimeout(()=>{
  //   PA_block.setMode(
  //     _proximityRangeUpper,
  //     _proximityRangeBottom,
  //     _brightnessRangeUpper,
  //     _brightnessRangeBottom,
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
  // const _interval = 200; // [ms]
  // setInterval(testGet, _interval);
  // setInterval(testGet2, _interval);
}

async function testGet() {
  const start = Date.now();
  const res = await PA_block.getSensorDataWait().catch(
    (error)=>{
      console.error(error);
      return {proximity: -1, brightness: -1};
    }
  );
  const end = Date.now();
  console.log('get: ' + res.proximity + ', ' + res.brightness + '  ' + (end-start) + 'ms');
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

async function sampleTH(peripheral) {
  if (!mesh_th.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  const TH_block = new mesh_th(peripheral);
  await TH_block.connectWait();

  TH_block.onNotify = ((response) => {
    console.log('ID: ' + response.requestId + ', temp: ' + response.temperature + ', hum: ' + response.humidity);
  });

  const _temp_upper = 50;
  const _temp_bottom = -10;
  const _humi_upper = 100;
  const _humi_bottom = 0;
  const _request_id = 15;
  const _notify_type = mesh_th.NotifyType.ONCE + mesh_th.NotifyType.ALWAYS;
  TH_block.setMode(_temp_upper, _temp_bottom, 17, _humi_upper, _humi_bottom, 17, _notify_type, _request_id);
}

var MD_block = null;
async function sampleMD(peripheral) {
  if (!mesh_md.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  MD_block = new mesh_md(peripheral);
  await MD_block.connectWait();
  MD_block.setMode(0x01, 500, 500, 6);
  MD_block.onNotify = ((response) => {
    console.log(response);
  });
  setInterval(getDataMD, 5000);
}

async function getDataMD() {
  const res = await MD_block.getDataWait();
  console.log(res);
}

async function sampleGP(peripheral) {
  if (!mesh_gp.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  const GP_block = new mesh_gp(peripheral);
  await GP_block.connectWait();

  const _din = {p1:false,p2:false,p3:true};
  const _din_notify = {p1:false,p2:false,p3:true};
  const _dout = {p1:false,p2:false,p3:true};
  const _pwm = 200;
  const _vcc = mesh_gp.VCC.ON;
  const _condition = mesh_gp.ANALOG_IN_EVENT_CONDITION.BELOW_THRESHOLD;

  GP_block.onPwmNotify = ((id, level) => {
    console.log('[PWM] id: ' + id + ', level: ' + level);
  });
  GP_block.onDigitalInEventNotify = ((pin, state) => {
    console.log('[Din] pin: ' + pin + ', state: ' + state);
  });
  GP_block.onAnalogInEventNotify = ((level) => {
    console.log('[Ain] level: ' + level);
  });
  GP_block.onDigitalInNotify = ((pin, state) => {
    console.log('[DinState] pin: ' + pin + ', state: ' + state);
  });

  let _count = 0;
  setInterval(()=>{
    if (_count % 2 == 0) {
      GP_block.setMode(_din, _din_notify, _dout, _pwm, _vcc, 0, 0, _condition);
    } else {
      GP_block.setMode(_din, _din_notify, _dout, 0, _vcc, 0, 0, _condition);
    }
    GP_block.setPWMNotify(_count);
    _count ++;
  },1500);
}