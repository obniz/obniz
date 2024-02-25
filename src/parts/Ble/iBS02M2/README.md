# iBS02M2

External Input sensor by INGICS

## Available modes

- Beacon mode

## Beacon data (getData())

- battery: Battery voltage
- input_trigger: True when the external input detects

## Use case

```javascript
// Javascript
const iBS02M2 = Obniz.getPartsClass('iBS02M2');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not iBS02M2
  const mode = iBS02M2.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new iBS02M2(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
