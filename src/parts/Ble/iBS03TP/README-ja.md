# iBS03TP

INGICS社製のプローブ付き防水温度センサー

![](image.jpg)

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- battery : 電池電圧
- button : ボタンを押すとtrue
- moving : 動くとtrue
- hall_sensor : 磁石が近づくとtrue
- temperature : 本体側の温度(℃)
- probe_temperature : プローブの温度


## 使用例

```javascript
// Javascript
const iBS03TP = Obniz.getPartsClass('iBS03TP');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // 動作モードを取得、iBS03TPでないときはnullに
  const mode = iBS03TP.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new iBS03TP(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
