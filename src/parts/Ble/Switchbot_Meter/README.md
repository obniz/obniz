# Switchbot_Meter

Switchbot Meter (WoSensorTH)　module

## getData()

- temperature: number;
- humidity: number;
- battery: number;

## Example

```javascript
// Javascript
const Switchbot_Meter = Obniz.getPartsClass("Switchbot_Meter");
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Switchbot_Meter.isDevice(peripheral)) {
    console.log(Switchbot_Meter.getData(peripheral));
  }
};
await obniz.ble.scan.startWait(null, {duplicate: true, duration: null});
```
