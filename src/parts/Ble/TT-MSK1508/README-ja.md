# ドリップナビセンサー

トライテック社製のBLE通信の点滴流量計です。

![](./image.jpg)

## データ取得
アドバタイズされているデータを取得。


結果は次のフォーマットで取得できます
```
{
  patientId: 患者ID;
  operatingMode: 動作状態;
  flowRateStatus: 流量判定;
  batteryStatus: バッテリー状態;
  model: 機種;
  totalDoseVolume: 積算投与量 (mL);
  totalDoseTime: 積算投与時間 (分);
  infusionType: 輸液セット種類;
  sensorId: センサーID;
  errors: エラー情報;
  battery: バッテリー残量 (%);
}
```


```javascript
// Javascript Example
const TT_MSK1508 = Obniz.getPartsClass('TT_MSK1508');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
  if (TT_MSK1508.isDevice(p)) {
    const data = TT_MSK1508.getData(p);
    console.log(data);
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
