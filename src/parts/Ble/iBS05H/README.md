# iBS05H

Magnet sensor by INGICS

![](image.jpg)

## Available modes

- Beacon mode

## Beacon data (getData())

- battery: Battery voltage
- hall_sensor: True when the magnet approaches
- count: Number of times the magnet approaches

## Use case

```javascript
// Javascript
const iBS05H = Obniz.getPartsClass('iBS05H');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not iBS05H
  const mode = iBS05H.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new iBS05H(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
