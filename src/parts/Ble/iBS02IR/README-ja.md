# iBS02IR

INGICS社製の障害物検知センサー

![](image.jpg)

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- battery: 電池電圧
- event: センサーに反応があるときtrue

## 使用例

```javascript
// Javascript
const iBS02IR = Obniz.getPartsClass('iBS02IR');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS02IRでないときはnullに
  const mode = iBS02IR.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS02IR(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
