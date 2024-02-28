# Switchbot_Meter_Plus

Switchbot Meter Plus (WoSensorTH)　module

## getData()

- temperature: number;
- humidity: number;
- battery: number;

## Example

```javascript
// Javascript
const Switchbot_Meter_Plus = Obniz.getPartsClass("Switchbot_Meter_Plus");
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Switchbot_Meter_Plus.isDevice(peripheral)) {
    console.log(Switchbot_Meter_Plus.getData(peripheral));
  }
};
await obniz.ble.scan.startWait(null, {duplicate: true, duration: null});
```
