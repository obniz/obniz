# iBS01

Beacon by INGICS

Support device

- iBS01
- iBS01G(Old model)
- iBS01H(Old model)

## Available modes

- Beacon mode

## Beacon data (getData())

- battery: Battery voltage
- button: True when you press the button
- hall_sensor: True when the magnet approaches (iBS01H only)
- moving: True when moved (iBS01G only)
- fall: True when falling (iBS01G only)

## Use case

```javascript
// Javascript
const iBS01 = Obniz.getPartsClass('iBS01');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not iBS01
  const mode = iBS01.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new iBS01(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
