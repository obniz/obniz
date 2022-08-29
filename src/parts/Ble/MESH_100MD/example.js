const Obniz = require('obniz');
const MESH_100MD = Obniz.getPartsClass('MESH_100MD');

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
      if (!MESH_100MD.isMESHblock(peripheral)) {
        return;
      }
      console.log('found');

      // Create an instance
      const motionBlock = new MESH_100MD(peripheral);

      // Connect to the Motion block
      await motionBlock.connectWait();
      console.log('connected');

      // Set event handler
      motionBlock.onSensorEvent = (motionState, notifyMode) => {
        switch (motionState) {
          case MESH_100MD.MotionState.DETECTED: {
            console.log('Detected !');
            break;
          }
          case MESH_100MD.MotionState.NOT_DETECTED: {
            console.log('Not Detected.');
            break;
          }
          default: {
            console.log('Starting up...');
            break;
          }
        }
        void notifyMode;
      };

      // Prepare params
      const notifyMode = MESH_100MD.NotifyMode.ALWAYS;

      // Write
      motionBlock.setMode(notifyMode);
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
