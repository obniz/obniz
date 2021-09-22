# iBS01T

INGICS社製の温湿度センサー

![](image.jpg)

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- battery: 電池電圧
- button: ボタンを押すとtrue
- moving: 動くとtrue
- reed : reedビットが1のときtrue
- temperature: 温度(℃)
- humidity: 湿度(%)

## 使用例

```javascript
// Javascript
const iBS01T = Obniz.getPartsClass('iBS01T');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS01Tでないときはnullに
  const mode = iBS01T.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS01T(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
