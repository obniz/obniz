# Switchbot_WoIOSensorTH

Switchbot Indoor/Outdoor Thermo-Hygrometer (WoIOSensorTH)　module

## getData()

- temperature: number;
- fahrenheit: boolean;
- humidity: number;
- battery: number;

## Example

```javascript
// Javascript
const Switchbot_IOSensorTH = Obniz.getPartsClass("Switchbot_IOSensorTH");
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Switchbot_IOSensorTH.isDevice(peripheral)) {
    console.log(Switchbot_IOSensorTH.getData(peripheral));
  }
};
await obniz.ble.scan.startWait(null, {duplicate: true, duration: null});
```
