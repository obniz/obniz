# Tr4

T and D社製のBLE通信の温度センサシリーズです

TR41A, TR42A、TR43Aに対応しています

[//]: # (![]&#40;./image.jpg&#41;)

## データ取得
アドバタイズされているデータを取得


結果は次のフォーマットで取得できます
```json
{
  temperature: 温度 [度];
  humidity?: 湿度;
}
```


```javascript
// Javascript Example
const tr4A = Obniz.getPartsClass('TR4A');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (tr4A.isDevice(p)) {
        const data = tr4A.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
