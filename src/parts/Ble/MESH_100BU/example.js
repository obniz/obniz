const Obniz = require('obniz');
const MESH_100BU = Obniz.getPartsClass('MESH_100BU');

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
      if (!MESH_100BU.isMESHblock(peripheral)) {
        return;
      }
      console.log('found');

      // Create an instance
      const buttonBlock = new MESH_100BU(peripheral);

      // Connect to the Button block
      await buttonBlock.connectWait();
      console.log(`connected: ${buttonBlock.peripheral.localName}`);

      buttonBlock.onSinglePressed = () => {
        console.log('single pressed');
      };

      buttonBlock.onDoublePressed = () => {
        console.log('double pressed');
      };

      buttonBlock.onLongPressed = () => {
        console.log('long pressed');
      };
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
