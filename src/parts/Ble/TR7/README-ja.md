# TR7 series

T and D社製のBLE通信の温湿度センサシリーズです。

TR71, TR72、TR75に対応しています。

![](./image.jpg)

## データ取得
アドバタイズされているデータを取得。


結果は次のフォーマットで取得できます
```
{
  temperature: 温度 [度];
  humidity: 湿度 [パーセント];
}
```


```javascript
// Javascript Example
const TR7 = Obniz.getPartsClass('TR7');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (TR7.isDevice(p)) {
        const data = TR7.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
