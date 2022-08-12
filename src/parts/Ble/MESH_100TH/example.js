// const Obniz = require('obniz');
const Obniz = require('../../../../index.js'); // local
const MESH_100TH = Obniz.getPartsClass('MESH_100TH');

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
      if (!MESH_100TH.isMESHblock(peripheral)) {
        return;
      }
      console.log('found');

      // Create an instance
      const temphumidBlock = new MESH_100TH(peripheral);

      // Connect to the Temperature & Humidity block
      await temphumidBlock.connectWait();
      console.log('connected');

      // Set event handler
      temphumidBlock.onSensorEvent = (temperature, humidity) => {
        console.log('temperature: ' + temperature + ', humidity: ' + humidity);
      };

      // Prepare params
      const notifyMode = MESH_100TH.NotifyMode.ALWAYS;
      const tempUpper = 50;
      const tempBottom = -10;
      const humidUpper = 100;
      const humidBottom = 0;
      const tempCondition =
        MESH_100TH.EmitCondition.ABOVE_UPPER_AND_ABOVE_BOTTOM;
      const humidCondition =
        MESH_100TH.EmitCondition.ABOVE_UPPER_AND_ABOVE_BOTTOM;

      // Write
      temphumidBlock.setMode(
        tempUpper,
        tempBottom,
        humidUpper,
        humidBottom,
        tempCondition,
        humidCondition,
        notifyMode
      );
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
