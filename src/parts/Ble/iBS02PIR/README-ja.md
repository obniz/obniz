# iBS02PIR

INGICS社製の赤外線近接センサー

![](image.jpg)

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- battery: 電池電圧
- event: センサーに反応があるときtrue

## 使用例

```javascript
// Javascript
const iBS02PIR = Obniz.getPartsClass('iBS02PIR');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS02PIRでないときはnullに
  const mode = iBS02PIR.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS02PIR(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
