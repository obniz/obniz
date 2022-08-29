const Obniz = require('obniz');
const MESH_100GP = Obniz.getPartsClass('MESH_100GP');

const obnizId = 'XXXXXXXX'; // WRITE YOUR OBNIZ ID

const obniz = new Obniz(obnizId, {
  access_token: null,
});

// Connected.
obniz.onconnect = async () => {
  console.log(`connected obniz ${obniz.id}`);
  try {
    await obniz.ble.initWait();
    obniz.ble.scan.onfind = async (peripheral) => {
      if (!MESH_100GP.isMESHblock(peripheral)) {
        return;
      }
      console.log('found');

      // Create an instance
      const gpioBlock = new MESH_100GP(peripheral);

      // Connect to the GPIO block
      await gpioBlock.connectWait();
      console.log('connected');

      // Get sensor data
      const targetPin = MESH_100GP.Pin.P1;
      const digitalInputState = await gpioBlock.getDigitalInputDataWait(
        targetPin
      );
      switch (digitalInputState) {
        case MESH_100GP.DigitalInputState.HIGH: {
          console.log('DigitalInput: High');
          break;
        }
        case MESH_100GP.DigitalInputState.LOW: {
          console.log('DigitalInput: Low');
          break;
        }
        default:
          break;
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
