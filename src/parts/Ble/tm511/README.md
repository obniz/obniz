# TM511

BLE enabled acceleration sensor.

![](image.jpg)

## isDevice(BleRemotePeripheral)

Returns true if a device was found.

```javascript
// Javascript Example
const TM511 = Obniz.getPartsClass('TM511');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (TM511.isDevice(p)) {
        const data = TM511.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getData(BleRemotePeripheral)

Reading a acceleration data from BLE advertisement

- x,y,z Acceleration
- battery Battery Level

```javascript
// Javascript Example
const TM511 = Obniz.getPartsClass('TM511');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (TM511.isDevice(p)) {
        const data = TM511.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
