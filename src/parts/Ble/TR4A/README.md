# Tr4A

This is a series of temperature sensors for BLE communication manufactured by T and D.
It supports TR41A, TR42A, and TR43A.


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
