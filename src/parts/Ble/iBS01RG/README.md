# iBS01RG

3-axis acceleration sensor by INGICS

![](image.jpg)

## Available modes

- Beacon mode

## Beacon data (getData())

- battery: Battery voltage
- button: True when you press the button
- active: True when moved
- acceleration: X, Y, Z axis of acceleration

## Use case

```javascript
// Javascript
const iBS01RG = Obniz.getPartsClass('iBS01RG');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not iBS01RG
  const mode = iBS01RG.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new iBS01RG(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
