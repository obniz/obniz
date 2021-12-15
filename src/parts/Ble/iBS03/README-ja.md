# iBS03

INGICS社製の防水磁気センサー

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
const iBS03 = Obniz.getPartsClass('iBS03');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS03でないときはnullに
  const mode = iBS03.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS03(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
