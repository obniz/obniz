# Switchbot_Bot

Switchbot Bot (WoHand)　module

## 対応モード

- スイッチボットモードのみ（非暗号化モードのみ）

## getData()

- mode: boolean;
- state: boolean;
- battery: number;

## Example

```javascript
// Javascript
const Switchbot_Bot = Obniz.getPartsClass("Switchbot_Bot");
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Switchbot_Bot.isDevice(peripheral)) {
    console.log(Switchbot_Bot.getData(peripheral));
    const sw = new Switchbot_Bot(peripheral);

    console.log("connecting to switchbot...")
    await sw.connectWait();
    console.log("connected to switchbot")
    
    await sw.pressWait();
    await sw.turnOnWait();
    await sw.turnOffWait();
    await sw.downWait();
    await sw.upWait();
  }
};
await obniz.ble.scan.startWait(null, {duplicate: true, duration: null});
```
