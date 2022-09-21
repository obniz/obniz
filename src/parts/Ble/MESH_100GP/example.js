const Obniz = require('obniz');
const MESH_100GP = Obniz.getPartsClass('MESH_100GP');

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
      if (!MESH_100GP.isMESHblock(peripheral)) {
        return;
      }
      console.log('found');

      // Create an instance
      const gpioBlock = new MESH_100GP(peripheral);

      // Connect to the GPIO block
      await gpioBlock.connectWait();
      console.log(`connected: ${gpioBlock.peripheral.localName}`);

      // Get sensor data
      gpioBlock.onDigitalInputEvent = (pin, digitalInputState) => {
        const _pin =
          pin === MESH_100GP.Pin.P1
            ? `DIN1`
            : pin === MESH_100GP.Pin.P2
            ? `DIN2`
            : `DIN3`;
        const _state =
          digitalInputState === MESH_100GP.DigitalInputState.HIGH
            ? `High`
            : `Low`;
        console.log(`DigitalInput: ${_pin} ${_state}`);
      };

      // Prepare params
      const digitalInputLow2High = { p1: true, p2: true, p3: true };
      const digitalInputHigh2Low = { p1: true, p2: true, p3: true };

      // Write
      gpioBlock.setModeDigitalInput(digitalInputLow2High, digitalInputHigh2Low);
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
