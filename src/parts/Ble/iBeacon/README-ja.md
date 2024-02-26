# iBeacon

iBeaconフォーマットのビーコンです

## データ取得

アドバタイズされているデータを取得

- uuid: UUID of iBeacon. like "44444444-e1a5-4838-a62a-22d35d00c35b"
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
