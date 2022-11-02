# INKBIRD

INKBIRD社製の温度・湿度センサシリーズです。

ITH-12S,IBS-TH1,IBS-TH2 PLUSに対応しています。



## データ取得
アドバタイズされているデータを取得


結果は次のフォーマットで取得できます
```json
{
  temperature: 温度 [度];
  humidity?: 湿度 [パーセント];
}
```


```javascript
// Javascript Example
const INKBIRD = Obniz.getPartsClass('INKBIRD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (INKBIRD.isDevice(p)) {
        const data = INKBIRD.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
