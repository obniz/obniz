# iBS03T_RH

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
- humidity: 湿度(%)

## 使用例

```javascript
// Javascript
const iBS03T_RH = Obniz.getPartsClass('iBS03T_RH');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS03T_RHでないときはnullに
  const mode = iBS03T_RH.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS03T_RH(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
