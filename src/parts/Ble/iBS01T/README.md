# iBS01T

Temperature & humidity sensor by INGICS

![](image.jpg)

## Available modes

- Beacon mode

## Beacon data (getData())

- battery: Battery voltage
- button: True when you press the button
- moving: True when moved
- reed: True when reed bit 1
- temperature: Temperature (℃)
- humidity: Humidity (%)

## Use case

```javascript
// Javascript
const iBS01T = Obniz.getPartsClass('iBS01T');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not iBS01T
  const mode = iBS01T.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new iBS01T(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
