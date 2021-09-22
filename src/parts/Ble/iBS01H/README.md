# iBS01H

Opening and closing detection sensor by INGICS

![](image.jpg)

## Available modes

- Beacon mode

## Beacon data (getData())

- battery: Battery voltage
- button: True when you press the button
- hall_sensor: True when the magnet approaches

## Use case

```javascript
// Javascript
const iBS01H = Obniz.getPartsClass('iBS01H');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not iBS01H
  const mode = iBS01H.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new iBS01H(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
