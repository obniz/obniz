// const Obniz = require('obniz');
const Obniz = require('../../../../index.js'); // local
const mesh_th = Obniz.getPartsClass('MESH_100TH');

// const obnizId = '00000000';
const obnizId = '87287267'; // Sugimoto

const obniz = new Obniz(obnizId, {
  access_token: null,
});

// Connected.
obniz.onconnect = async () => {
  console.log(`connected obniz ${obniz.id}`);
  try {
    await obniz.ble.initWait();
    obniz.ble.scan.onfind = async (peripheral) => {
      sampleTH(peripheral);
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

var TH_block = null;
async function sampleTH(peripheral) {
  if (!mesh_th.sameSerialNumberBlock(peripheral, '1019853')) {
  // if (!mesh_th.isMESHblock(peripheral)) {
    return;
  }
  console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
  TH_block = new mesh_th(peripheral);
  await TH_block.connectWait();

  TH_block.onSensorEvent = ((temperature, humidity) => {
    console.log('<Event> temp: ' + temperature + ', hum: ' + humidity);
  });

  const _temp_upper = 50;
  const _temp_bottom = -10;
  
  const _temp_condition = 
    mesh_th.EmitCondition.ABOVE_UPPER_AND_ABOVE_BOTTOM;
    // mesh_th.EmitCondition.ABOVE_UPPER_AND_BELOW_BOTTOM;
    // mesh_th.EmitCondition.BELOW_UPPER_AND_ABOVE_BOTTOM;
    // mesh_th.EmitCondition.BELOW_UPPER_AND_BELOW_BOTTOM;
  
  const _humi_upper = 70;
  const _humi_bottom = 60;
  
  const _humi_condition = 
    // mesh_th.EmitCondition.ABOVE_UPPER_AND_ABOVE_BOTTOM;
    // mesh_th.EmitCondition.ABOVE_UPPER_AND_BELOW_BOTTOM;
    mesh_th.EmitCondition.BELOW_UPPER_AND_ABOVE_BOTTOM;
    // mesh_th.EmitCondition.BELOW_UPPER_AND_BELOW_BOTTOM;
  
  const _notify_type = 
    /**
     * select 1 param => combination 7
     */
    // mesh_th.NotifyMode.STOP;
    // mesh_th.NotifyMode.EMIT_TEMPERATURE;
    mesh_th.NotifyMode.EMIT_HUMIDITY;
    // mesh_th.NotifyMode.UPDATE_TEMPERATURE;
    // mesh_th.NotifyMode.UPDATE_HUMIDITY;
    // mesh_th.NotifyMode.ONCE;
    // mesh_th.NotifyMode.ALWAYS;
    /**
     * select 2 params => combination 15
     */
    // mesh_th.NotifyMode.EMIT_TEMPERATURE + mesh_th.NotifyMode.EMIT_HUMIDITY;
    // mesh_th.NotifyMode.EMIT_TEMPERATURE + mesh_th.NotifyMode.UPDATE_TEMPERATURE;
    // mesh_th.NotifyMode.EMIT_TEMPERATURE + mesh_th.NotifyMode.UPDATE_HUMIDITY;
    // mesh_th.NotifyMode.EMIT_TEMPERATURE + mesh_th.NotifyMode.ONCE;
    // mesh_th.NotifyMode.EMIT_TEMPERATURE + mesh_th.NotifyMode.ALWAYS;
    // mesh_th.NotifyMode.EMIT_HUMIDITY + mesh_th.NotifyMode.UPDATE_TEMPERATURE;
    // mesh_th.NotifyMode.EMIT_HUMIDITY + mesh_th.NotifyMode.UPDATE_HUMIDITY;
    // mesh_th.NotifyMode.EMIT_HUMIDITY + mesh_th.NotifyMode.ONCE;
    // mesh_th.NotifyMode.EMIT_HUMIDITY + mesh_th.NotifyMode.ALWAYS;
    // mesh_th.NotifyMode.UPDATE_TEMPERATURE + mesh_th.NotifyMode.UPDATE_HUMIDITY;
    // mesh_th.NotifyMode.UPDATE_TEMPERATURE + mesh_th.NotifyMode.ONCE;
    // mesh_th.NotifyMode.UPDATE_TEMPERATURE + mesh_th.NotifyMode.ALWAYS;
    // mesh_th.NotifyMode.UPDATE_HUMIDITY + mesh_th.NotifyMode.ONCE;
    // mesh_th.NotifyMode.UPDATE_HUMIDITY + mesh_th.NotifyMode.ALWAYS;
    // mesh_th.NotifyMode.ONCE + mesh_th.NotifyMode.ALWAYS;
    /**
     * select 3 params => combination 20
     */
    /**
     * select 4 params => combination 15
     */
    /**
     * select 5 params => combination 6
     */
    // mesh_th.NotifyMode.EMIT_TEMPERATURE + mesh_th.NotifyMode.EMIT_HUMIDITY + mesh_th.NotifyMode.UPDATE_TEMPERATURE + mesh_th.NotifyMode.UPDATE_HUMIDITY + mesh_th.NotifyMode.ONCE;
    // mesh_th.NotifyMode.EMIT_TEMPERATURE + mesh_th.NotifyMode.EMIT_HUMIDITY + mesh_th.NotifyMode.UPDATE_TEMPERATURE + mesh_th.NotifyMode.UPDATE_HUMIDITY + mesh_th.NotifyMode.ALWAYS;
    // mesh_th.NotifyMode.EMIT_TEMPERATURE + mesh_th.NotifyMode.EMIT_HUMIDITY + mesh_th.NotifyMode.UPDATE_TEMPERATURE + mesh_th.NotifyMode.ONCE + mesh_th.NotifyMode.ALWAYS;
    // mesh_th.NotifyMode.EMIT_TEMPERATURE + mesh_th.NotifyMode.EMIT_HUMIDITY + mesh_th.NotifyMode.UPDATE_HUMIDITY + mesh_th.NotifyMode.ONCE + mesh_th.NotifyMode.ALWAYS;
    // mesh_th.NotifyMode.EMIT_TEMPERATURE + mesh_th.NotifyMode.UPDATE_TEMPERATURE + mesh_th.NotifyMode.UPDATE_HUMIDITY + mesh_th.NotifyMode.ONCE + mesh_th.NotifyMode.ALWAYS;
    // mesh_th.NotifyMode.EMIT_HUMIDITY + mesh_th.NotifyMode.UPDATE_TEMPERATURE + mesh_th.NotifyMode.UPDATE_HUMIDITY + mesh_th.NotifyMode.ONCE + mesh_th.NotifyMode.ALWAYS;
    /**
     * select 6 params(=all) => combination 6
     */
    // mesh_th.NotifyMode.EMIT_TEMPERATURE + mesh_th.NotifyMode.EMIT_HUMIDITY + mesh_th.NotifyMode.UPDATE_TEMPERATURE + mesh_th.NotifyMode.UPDATE_HUMIDITY + mesh_th.NotifyMode.ONCE + mesh_th.NotifyMode.ALWAYS;

  TH_block.setMode(
    _temp_upper, _temp_bottom,
    _humi_upper, _humi_bottom,
    _temp_condition, _humi_condition,
    _notify_type
  );

  /**
   * delay stop
   */
  // setTimeout(()=>{
  //   TH_block.setMode(
  //     _temp_upper, _temp_bottom,
  //     _humi_upper, _humi_bottom,
  //     _temp_condition, _humi_condition,
  //     mesh_th.NotifyMode.STOP
  //   );
  // }, 5 * 1000);

  /**
   * Continues getSensorDataWait
   */
  setInterval(getDataTH, 3000);
}

async function getDataTH() {
  const res = await TH_block.getSensorDataWait();
  console.log(res);
}
