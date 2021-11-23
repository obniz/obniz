# iBS04i

INGICS社製のビーコン(iBeacon準拠)

![](image.jpg)

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- battery: 電池電圧
- button: ボタンを押すとtrue
- uuid: iBeacon　UUID
- major: iBeacon　major
- minor: iBeacon　minor
- power: iBeacon　power
- rssi: 電波強度

## 使用例

```javascript
// Javascript
const iBS04i = Obniz.getPartsClass('iBS04i');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS04iでないときはnullに
  const mode = iBS04i.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS04i(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
    // iBeacon情報をコンソールに出力
    console.log(peripheral.iBeacon);
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
