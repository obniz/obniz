# iBS02PIR

Infrared proximity sensor by INGICS

![](image.jpg)

## Available modes

- Beacon mode

## Beacon data (getData())

- battery: Battery voltage
- event: True when the sensor reacts

## Use case

```javascript
// Javascript
const iBS02PIR = Obniz.getPartsClass('iBS02PIR');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not iBS02PIR
  const mode = iBS02PIR.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new iBS02PIR(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
