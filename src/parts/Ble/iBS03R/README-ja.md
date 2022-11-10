# iBS03R

INGICS社製の防水距離センサー

![](image.jpg)

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- battery: 電池電圧
- distance: 距離(mm)

## 使用例

```javascript
// Javascript
const iBS03R = Obniz.getPartsClass('iBS03R');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS03Rでないときはnullに
  const mode = iBS03R.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS03R(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
