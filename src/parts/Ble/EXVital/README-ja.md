# EXVital

WHERE社製のBLE通信のウェアラブル型活動量計


## データ取得

10秒に1回程度の頻度でアドバタイズされているデータを取得

- major: iBeacon major
- minor: iBeacon minor
- power: iBeacon power
- diastolic_pressure: 最低血圧
- systolic_pressure: 最高血圧
- arm_temp: 腕温度
- body_temp: 体温
- heart_rate: 心拍数
- battery: バッテリー電圧
- steps: 歩数

```javascript
// Javascript Example
const EXVital = Obniz.getPartsClass('EXVital');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (EXVital.isDevice(p)) {
        const device = new EXVital(p);
        const data = device.getData();
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

または

```javascript
// Javascript Example
const EXVital = Obniz.getPartsClass('EXVital');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (EXVital.isDevice(p)) {
        const data = EXVital.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
