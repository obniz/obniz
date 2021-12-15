# iBS05H

INGICS社製の磁気センサー

![](image.jpg)

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- battery: 電池電圧
- hall_sensor: 磁石が近づくとtrue
- count: 磁石が近づいた回数

## 使用例

```javascript
// Javascript
const iBS05H = Obniz.getPartsClass('iBS05H');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS05Hでないときはnullに
  const mode = iBS05H.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS05H(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
