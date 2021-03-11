# RS_BTWATTCH2
This is a power consumption meter for electrical outlets made by RATOC Systems, Inc. and can be turned on and off.

This device needs to be paired in advance. Press the button on the device for 3 seconds, and when the LED flashes, it is in pairing mode.
In the program

1. pair the device by putting it into pairing mode, and retrieve and save the key
2. connect to the device in normal mode with the pairing key you have already obtained

## Attention About Pairing

- You cannot share keys with another obnizID device. You can only use them on the device you paired them to.
- A second pairing with a device that has been paired once will result in an error. You can reset the device by pressing and holding the button for more than 10 seconds.

```javascript
// Javascript Example
await obniz.ble.initWait();
const RS_BTWATTCH2 = Obniz.getPartsClass("RS_BTWATTCH2");
obniz.ble.scan.onfind = async (peripheral) => {
  if (RS_BTWATTCH2.isDevice(peripheral)) {
    console.log("found");
    const checker = new RS_BTWATTCH2(peripheral);
    if (checker.isPairingMode()) {
      const pairedKeys = await checker.firstPairingWait();
      console.log(pairedKeys);
      // use this key at the next time.
      return;
    }
    // keys = pairedKeys
    const keys = '';
    await checker.connectWait(keys);
    console.log('connected');
    // get cunnret relay state
    const status = await checker.getPowerStateWait();
    console.log(`status ${status}`);
    // change to ON
    await checker.setPowerStateWait(true);
    // get Power Consumption
    const measured = await checker.getRealTimeDataWait();
    console.log(measured);
  }
};
await obniz.ble.scan.startWait();

```

See below for more details about each function.

[Reference](https://obniz.github.io/obniz/obnizjs/interfaces/parts.rs_btwattch2.rs_btwattch2.html)