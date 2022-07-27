// const Obniz = require('obniz');
const Obniz = require('../../../../index.js'); // local
const fetch = require('node-fetch');
const mesh_bu = Obniz.getPartsClass('MESH_100BU');
const mesh_le = Obniz.getPartsClass('MESH_100LE');
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
      // samplePA(peripheral);
      // sampleTH(peripheral);
      // sampleMD(peripheral);
      sampleGP(peripheral);
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
  if (!mesh_le.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  const LED_block = new mesh_le(peripheral);
  await LED_block.connectWait();

  const _red = 127;
  const _green = 0;
  const _blue = 0;
  const _total_time = 4000; // 4.000 seconds
  const _cycle_on_time = 512; // 0.500 seconds
  const _cycle_off_time = 512; // 0.500 seconds
  LED_block.lightup(_red, _green, _blue, _total_time, _cycle_on_time, _cycle_off_time, mesh_le.Pattern.SOFT);

  LED_block.onStatusButtonNotify = (()=>{console.log('status button pressed');});
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

  PA_block.onNotify = ((response) => {
    console.log(response);
  });

  const _notifyType = mesh_pa.NotifyType.ONCE + mesh_pa.NotifyType.ALWAYS;
  const _requestId = 15;
  PA_block.setMode(_notifyType, _requestId);

  // PA_block.getDataWait();
}

async function sampleTH(peripheral) {
  if (!mesh_th.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  const TH_block = new mesh_th(peripheral);
  await TH_block.connectWait();

  TH_block.onNotify = ((response) => {
    console.log('ID: ' + response.request_id + ', temp: ' + response.temperature + ', hum: ' + response.humidity);
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