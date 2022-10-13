# INKBIRD


This is a series of temperature and humidity sensors for BLE communication manufactured by INKBIRD.
It supports ITH-12S, IBS-TH1 and IBS-TH2 PLUS.


## getData
Get the data from advertisement.

Results can be retrieved in the following format
```json
{
  temperature: Temperature [degrees];
  humidity?: Humidity [percentage];
}
````


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
