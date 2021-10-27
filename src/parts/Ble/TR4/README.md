# Tr4


This is a series of temperature sensors for BLE communication manufactured by T and D.
It supports TR41, TR42, and TR45.

![](./image.jpg)

## getData
Get the data from advertisement.

Results can be retrieved in the following format
```json
{
  temperature: Temperature [degrees];
}
````


```javascript
// Javascript Example
const tr4 = Obniz.getPartsClass('TR4');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (tr4.isDevice(p)) {
        const data = tr4.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
