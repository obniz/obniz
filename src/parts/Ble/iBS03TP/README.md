# iBS03TP

Waterproof temperature sensor by INGICS.

![](image.jpg)

## Available modes

- Beacon mode

## Beacon data (getData())

- battery: Battery voltage
- button: True when you press the button
- moving: True when moved
- fall: True when falling
- temperature: Body side temperature (℃)
- probe_temperature: Probe side temperature (℃)

## Use case

```javascript
// Javascript
const iBS03TP = Obniz.getPartsClass('iBS03TP');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not iBS03TP
  const mode = iBS03TP.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new iBS03TP(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
