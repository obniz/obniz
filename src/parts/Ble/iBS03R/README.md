# iBS03R

Waterproof distance sensor by INGICS

![](image.jpg)

## Available modes

- Beacon mode

## Beacon data (getData())

- battery: Battery voltage
- distance: Distance (mm)

## Use case

```javascript
// Javascript
const iBS03R = Obniz.getPartsClass('iBS03R');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not iBS03R
  const mode = iBS03R.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new iBS03R(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
