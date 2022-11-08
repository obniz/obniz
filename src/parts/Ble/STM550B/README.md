# STM550B

EnOcean Temperature and Humidity Sensor

## 対応モード

- beacon mode

## getData()

- temperature: ℃
- humidity: %
- voltage: mV
- energy_level: %
- illumination_solar_cell: lux
- illumination_sensor: lux
- magnet_contact : True when there is a magnet nearby.

## Example

```javascript
// Javascript
const stm550b = Obniz.getPartsClass('STM550B');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {

  const mode = stm550b.getDeviceMode(peripheral);
  if (mode) {
    const device = new stm550b(peripheral, mode);
    console.log(device.getData());
  }


};
await obniz.ble.scan.startWait(null, {duplicate: true, duration: null});
```
