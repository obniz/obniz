# iBS01H

INGICS社製の開閉検知センサー

![](image.jpg)

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- battery: 電池電圧
- button: ボタンを押すとtrue
- hall_sensor: 磁石が近づくとtrue

## 使用例

```javascript
// Javascript
const iBS01H = Obniz.getPartsClass('iBS01H');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS01Hでないときはnullに
  const mode = iBS01H.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS01H(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
