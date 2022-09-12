# MM_BLEBC5

Beacon with accelerometer from Sanwa Supply.
It is necessary to set the beacon output with the dedicated application in advance.

Only supported if ACC is set for the frame type of any slot.

![](./image.jpg)


## Beacon data (getData())

- acceleration: Acceleration (±2G)
- battery: Battery level (%)

## Use case

```javascript
// Javascript
const MM_BLEBC5 = Obniz.getPartsClass('MM_BLEBC5');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not MM_BLEBC5
  const mode = MM_BLEBC5.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new MM_BLEBC5(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
