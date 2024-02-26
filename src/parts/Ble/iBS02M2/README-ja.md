# iBS02M2

INGICS社製の接点センサー

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- battery: 電池電圧
- input_trigger: センサーに反応があるときtrue

## 使用例

```javascript
// Javascript
const iBS02M2 = Obniz.getPartsClass('iBS02M2');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS02M2でないときはnullに
  const mode = iBS02M2.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS02M2(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
