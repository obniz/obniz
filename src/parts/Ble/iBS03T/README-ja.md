# iBS03T

INGICS社製の防水温度センサー

![](image.jpg)

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- battery: 電池電圧
- button: ボタンを押すとtrue
- moving: 動くとtrue
- fall: 落下するとtrue
- temperature: 温度(℃)

## 使用例

```javascript
// Javascript
const iBS03T = Obniz.getPartsClass('iBS03T');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS03Tでないときはnullに
  const mode = iBS03T.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS03T(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
