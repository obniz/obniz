const Obniz = require('obniz');
const MESH_100PA = Obniz.getPartsClass('MESH_100PA');

const obnizId = 'XXXXXXXX'; // WRITE YOUR OBNIZ ID

const obniz = new Obniz(obnizId, {
  access_token: null,
});

// Connected.
obniz.onconnect = async () => {
  console.log(`connected: obniz ${obniz.id}`);
  try {
    await obniz.ble.initWait();
    obniz.ble.scan.onfind = async (peripheral) => {
      if (!MESH_100PA.isMESHblock(peripheral)) {
        return;
      }
      console.log('found');

      // Create an instance
      const brightnessBlock = new MESH_100PA(peripheral);

      // Connect to the Brightness
      await brightnessBlock.connectWait();
      console.log(`connected: ${brightnessBlock.peripheral.localName}`);

      while (true) {
        // Get sensor data
        const data = await brightnessBlock.getSensorDataWait();
        console.log(
          'proximity: ' + data.proximity + ', brightness: ' + data.brightness
        );
        // wait 10[s]
        await new Promise((res) => setTimeout(res, 10 * 1000));
      }
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
