# SCBTGAAAC

Water leak sensor by ABLIC

![](image.jpg)

## Available modes

- Beacon mode

## Beacon data (getData())

name (major-minor)

## Use case

```javascript
// Javascript
const SCBTGAAAC = Obniz.getPartsClass('SCBTGAAAC');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not SCBTGAAAC
  const mode = SCBTGAAAC.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new SCBTGAAAC(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
