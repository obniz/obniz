# Switchbot_ContactSensor

Switchbot Contact Sensor (WoContact)　module

## getData()

- scopeTested: boolean;
- someoneIsMoving: boolean;
- battery: number;
- pir: number;
- hal: number;
- halState: 'close' | 'open' | 'timeoutNotClose';
- lightLevel: 'light' | 'dark';
- numberOfEntrances: number;
- numberOfGoOutCounter: number;
- buttonPushCounter: number;

## Example

```javascript
// Javascript
const Switchbot_ContactSensor = Obniz.getPartsClass("Switchbot_ContactSensor");
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Switchbot_ContactSensor.isDevice(peripheral)) {
    console.log(Switchbot_ContactSensor.getData(peripheral));
  }
};
await obniz.ble.scan.startWait(null, {duplicate: true, duration: null});
```
