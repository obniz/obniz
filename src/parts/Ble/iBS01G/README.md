# iBS01G

Moving and falling detection sensor by INGICS

## Available modes

- Beacon mode

## Beacon data (getData())

- battery: Battery voltage
- button: True when you press the button
- moving: True when moved
- fall: True when falling

## Use case

```javascript
// Javascript
const iBS01G = Obniz.getPartsClass('iBS01G');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not iBS01G
  const mode = iBS01G.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new iBS01G(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
