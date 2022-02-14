# STM550B

EnOceanの温湿度センサー

## 対応モード

- ビーコンモード

## ビーコンデータ(getData())

- temperature: 温度(℃)
- humidity: 湿度(%)
- voltage: 電池電圧(mV)
- energy_level: エネルギーレベル（%）
- illumination_solar_cell: ソーラーセルの明るさ(lux)
- illumination_sensor: センサの明るさ(lux)
- magnet_contact : 近くにマグネットがあるときにtrue

## 使用例

```javascript
// Javascript
const stm550b = Obniz.getPartsClass('STM550B');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {

  // 動作モードを取得、stm550でないときはnullに
  const mode = stm550b.getDeviceMode(peripheral);
  if (mode) {
    // インスタンスを生成
    const device = new stm550b(peripheral, mode);
    // データを取得し、コンソールに出力
    console.log(device.getData());
  }


};
await obniz.ble.scan.startWait(null, {duplicate: true, duration: null});
```
