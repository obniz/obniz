# iBS04

INGICS社製のビーコン

![](image.jpg)

## Available modes

- Beacon mode

## Beacon data (getData())

- battery: Battery voltage
- button: True when you press the button

## Use case

```javascript
// Javascript
const iBS04 = Obniz.getPartsClass('iBS04');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not iBS04
  const mode = iBS04.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new iBS04(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
