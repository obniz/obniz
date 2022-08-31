const Obniz = require('../../../../index.js'); // local
const MESH_100AC = Obniz.getPartsClass('MESH_100AC');

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
      if (!MESH_100AC.isMESHblock(peripheral)) {
        return;
      }
      console.log('found');

      // Create an instance
      const moveBlock = new MESH_100AC(peripheral);

      // Connect to the Move block
      await moveBlock.connectWait();
      console.log(`connected: ${moveBlock.peripheral.localName}`);

      // Tap Event
      moveBlock.onTapped = (accele) => {
        console.log(
          'tapped! (ax, ay, az) = (' +
            accele.x +
            ', ' +
            accele.y +
            ',' +
            accele.z +
            ')'
        );
      };

      // Shake Event
      moveBlock.onShaked = (accele) => {
        console.log(
          'shaked! (ax, ay, az) = (' +
            accele.x +
            ', ' +
            accele.y +
            ',' +
            accele.z +
            ')'
        );
      };

      // Flip Event
      moveBlock.onFlipped = (accele) => {
        console.log(
          'flipped! (ax, ay, az) = (' +
            accele.x +
            ', ' +
            accele.y +
            ',' +
            accele.z +
            ')'
        );
      };

      // Orientation Event
      moveBlock.onOrientationChanged = (orientation, accele) => {
        console.log(
          'orientation changed! ' +
            orientation +
            ', (ax, ay, az) = (' +
            accele.x +
            ', ' +
            accele.y +
            ',' +
            accele.z +
            ')'
        );
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
