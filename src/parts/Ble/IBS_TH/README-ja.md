# IBS-THシリーズ

INKBIRD社製のBLE対応の温湿度センサーです。  
IBS-TH1, IBS-TH2 PLUSに対応しています。

![](./image.jpg)

## データ取得
アドバタイズされているデータを取得。

- temperature:  温度 \[度]
- humidity: 湿度 \[%]
- battery: 充電 \[%]


```javascript
// Javascript Example
const IBS_TH = Obniz.getPartsClass('IBS_TH');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
    if (airMier.isDevice(peripheral)) {
        const data = IBS_TH.getData(peripheral);
        console.log(data);
        //出力例 {temperature: 26.68, humidity: 40.51, battery: 77}
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
