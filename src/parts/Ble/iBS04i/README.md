# iBS04i

Beacon by INGICS (It conforms to iBeacon)

![](image.jpg)

## Available modes

- Beacon mode

## Beacon data (getData())

- battery: Battery voltage
- button: True when you press the button
- uuid: iBeacon　UUID
- major: iBeacon　major
- minor: iBeacon　minor
- power: iBeacon　power
- rssi: Signal strength

## Use case

```javascript
// Javascript
const iBS04i = Obniz.getPartsClass('iBS04i');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not iBS04i
  const mode = iBS04i.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new iBS04i(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
    // Output iBeacon information to the console
    console.log(peripheral.iBeacon);
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
