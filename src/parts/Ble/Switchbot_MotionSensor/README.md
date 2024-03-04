# Switchbot_MotionSensor

Switchbot Motion Sensor (WoMotion)　module

## getData()

- battery: number;
- scopeTested: boolean;
- someoneIsMoving: boolean;
- pirUtc: number;
- ledState: 'enable' | 'disable';
- iotState: 'enable' | 'disable';
- sensingDistance: 'long' | 'middle' | 'short';
- lightIntensity: 'dark' | 'bright';

## Example

```javascript
// Javascript
const Switchbot_MotionSensor = Obniz.getPartsClass("Switchbot_MotionSensor");
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Switchbot_MotionSensor.isDevice(peripheral)) {
    console.log(Switchbot_MotionSensor.getData(peripheral));
  }
};
await obniz.ble.scan.startWait(null, {duplicate: true, duration: null});
```
