const Obniz = require('obniz');
const MESH_100LE = Obniz.getPartsClass('MESH_100LE');

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
      if (!MESH_100LE.isMESHblock(peripheral)) {
        return;
      }
      console.log('found');

      // Create an instance
      const ledBlock = new MESH_100LE(peripheral);

      // Connect to the LED block
      await ledBlock.connectWait();
      console.log(`connected: ${ledBlock.peripheral.localName}`);

      // Prepare params
      const colors = {
        red: 15, // Set LED-Red in the range of 0 to 127.
        green: 63, // Set LED-Green in the range of 0 to 127.
        blue: 0, // Set LED-Blue in the range of 0 to 127.
      };
      const totalTime = 4000; // Set the total control time in the range of 0 to 65,535[ms].
      const cycleOnTime = 1000; // Set the light on time in cycle in the range of 0 to 65,535[ms].
      const cycleOffTime = 500; // Set the light off time in cycle in the range of 0 to 65,535[ms].
      const pattern = MESH_100LE.Pattern.FIREFLY; // Set the blinking pattern to blink or firefly.

      // Write
      ledBlock.setLed(colors, totalTime, cycleOnTime, cycleOffTime, pattern);
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
