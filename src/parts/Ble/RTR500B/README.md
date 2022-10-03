# RTR500B


This is a series of temperature sensors for BLE communication manufactured by T and D.
It supports RTR503B and RTR507B.

[//]: # (![]&#40;./image.jpg&#41;)

## getData
Get the data from advertisement.

Results can be retrieved in the following format
```json
{
  temperature: Temperature [degrees];
  humidity?: Humidity;
}
````


```javascript
// Javascript Example
const RTR500B = Obniz.getPartsClass('RTR500B');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (RTR500B.isDevice(p)) {
        const data = RTR500B.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
