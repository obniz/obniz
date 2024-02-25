# iBeacon

iBeacon Format general beacon

## Get a Data

Get a data from advertisement

- uuid: UUID of iBeacon
- major: 0x0000 to 0xFFFF
- minor: 0x0000 to 0xFFFF
- power: power of iBeacon(not rssi)


```javascript
// Javascript Example
const iBeacon = Obniz.getPartsClass('iBeacon');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (iBeacon.isDevice(p)) {
        const rssi = p.rssi;
        const data = iBeacon.getData(p);
        console.log(data, rssi);
    }
};
await obniz.ble.scan.startWait();
```
