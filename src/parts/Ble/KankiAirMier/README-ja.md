# 換気エアミエル

ステップワン社製のBLE通信のCo2環境センサです

![](./image.jpg)

## データ取得
アドバタイズされているデータを取得



- co2: 二酸化炭素濃度 \[ppm]
- temperature  温度 \[度]
- humidity: 湿度 \[%RH]
- sequenceNumber: シーケンス番号。再計測のたびに数字がカウントされる
- deviceName: デバイス名


```javascript
// Javascript Example
const airMier = Obniz.getPartsClass('KankiAirMier');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (airMier.isDevice(p)) {
        const data = airMier.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
