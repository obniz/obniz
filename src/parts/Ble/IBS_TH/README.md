# IBS-TH Series

Temperature and humidity sensor made by INKBIRD.
Compatible with IBS-TH1, IBS-TH2 PLUS.

![](./image.jpg)

## データ取得
Get advertised data.

- temperature\[℃]
- humidity\[%]
- battery\[%]


```javascript
// Javascript Example
const IBS_TH = Obniz.getPartsClass('IBS_TH');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
    if (airMier.isDevice(peripheral)) {
        const data = IBS_TH.getData(peripheral);
        console.log(data);
        //output sample {temperature: 26.68, humidity: 40.51, battery: 77}
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
