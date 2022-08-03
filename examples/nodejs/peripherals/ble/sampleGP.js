// const Obniz = require('obniz');
const Obniz = require('../../../../index.js'); // local
const mesh_gp = Obniz.getPartsClass('MESH_100GP');

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
      sampleGP(peripheral);
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

let GP_block = null;
async function sampleGP(peripheral) {
  if (!mesh_gp.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  GP_block = new mesh_gp(peripheral);
  await GP_block.connectWait();

  /**
   * Event Notify
   */
   GP_block.onDigitalInputEvent = ((pin, state) => {
    const _name = (pin === mesh_gp.Pin.P1 ? 'Pin1' : (pin === mesh_gp.Pin.P2 ? 'Pin2' : 'Pin3'));
    console.log('<Event> digital input pin: ' + _name + ', state: ' + state);
  });
  GP_block.onAnalogInputEvent = ((level) => {
    console.log('<Event> analog input level: ' + level);
  });

  const _dinL2H = { p1:true, p2:false, p3:true };
  const _dinH2L = { p1:true, p2:false, p3:true };
  let _dout = { p1:true, p2:false, p3:true };
  const _pwm = 0;//200;
  const _vcc =
    // mesh_gp.Vcc.AUTO;
    // mesh_gp.Vcc.ON;
    mesh_gp.Vcc.OFF;
  const _condition =
    // mesh_gp.AnalogInEventCondition.NOT_NOTIFY;
    mesh_gp.AnalogInEventCondition.ABOVE_THRESHOLD;
    // mesh_gp.AnalogInEventCondition.BELOW_THRESHOLD;
  const _ainUpper = 30;
  const _ainBottom = 0;
  // GP_block.setMode(_dinL2H, _dinH2L, _dout, _pwm, _vcc, _ainUpper, _ainBottom, _condition);

  GP_block.setVOutput(mesh_gp.Vcc.ON);
  GP_block.setPwmOutput(100);

  // let _count = 0;
  // setInterval(()=>{
  //   if (_count % 2 == 0) {
  //     _dout = { p1:true, p2:false, p3:true };
  //   } else {
  //     _dout = { p1:false, p2:true, p3:false };
  //   }
  //   GP_block.setMode(_dinL2H, _dinH2L, _dout, _pwm, _vcc, _ainUpper, _ainBottom, _condition);
  //   _count ++;
  // }, 5 * 1000);

  const _interval = 2 * 1000;
  // setInterval(getDOUT, _interval, mesh_gp.Pin.P1);
  // setInterval(getDIN, _interval, mesh_gp.Pin.P2);
  // getAIN();
}

async function getAIN() {
  const res = await GP_block.getAnalogInputDataWait();
  console.log(res);
}

async function getPWM() {
  const res = await GP_block.getPwmDataWait();
  console.log('get ' + res);
}

async function getDIN(pin) {
  const _digitalInputState = await GP_block.getDigitalInputDataWait(pin);
  const _name = (pin === mesh_gp.Pin.P1 ? 'Pin1' : (pin === mesh_gp.Pin.P2 ? 'Pin2' : 'Pin3'));
  switch (_digitalInputState) {
    case mesh_gp.DigitalInputState.UP_EDGE:{
      console.log('getDigitalInputDataWait: ' + _name + ' UP');
      break;
    }
    case mesh_gp.DigitalInputState.DOWN_EDGE:{
      console.log('getDigitalInputDataWait: ' + _name + ' DOWN');
      break;
    }
    default:
      break;
  }
}

async function getDOUT(pin) {
  const _doutState = await GP_block.getDigitalOutputDataWait(pin);
  const _name = (pin === mesh_gp.Pin.P1 ? 'Pin1' : (pin === mesh_gp.Pin.P2 ? 'Pin2' : 'Pin3'));
  switch (_doutState) {
    case mesh_gp.VccState.OFF:{
      console.log('getDigitalOutputDataWait: ' + _name + ' OFF');
      break;
    }
    case mesh_gp.VccState.ON:{
      console.log('getDigitalOutputDataWait: ' + _name + ' ON');
      break;
    }
    default:
      break;
  }
}