# Switchbot_PlugMini

Switchbot Plug Mini (WoPlugMini)　module

## getData()

- sequenceNumber: number;
- powerState: 'on' | 'off' | null;
- hasDelay: boolean;
- hasTimer: boolean;
- alreadySyncTime: boolean;
- wifiRssi: number;
- overload: boolean; // Over 15A
- power: number; // W

## Example

```javascript
// Javascript
const Switchbot_PlugMini = Obniz.getPartsClass("Switchbot_PlugMini");
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Switchbot_PlugMini.isDevice(peripheral)) {
    console.log(Switchbot_PlugMini.getData(peripheral));
  }
};
await obniz.ble.scan.startWait(null, {duplicate: true, duration: null});
```
