# iBS03T

Waterproof temperature sensor by INGICS.

![](image.jpg)

## Available modes

- Beacon mode

## Beacon data (getData())

- battery: Battery voltage
- button: True when you press the button
- moving: True when moved
- fall: True when falling
- temperature: Temperature (℃)

## Use case

```javascript
// Javascript
const iBS03T = Obniz.getPartsClass('iBS03T');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not iBS03T
  const mode = iBS03T.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new iBS03T(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
