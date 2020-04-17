# TM551

BLE enabled acceleration sensor.

![](image.jpg)

## isDevice(BleRemotePeripheral)

Returns true if a device was found.

```javascript
// Javascript Example
const TM551 = Obniz.getPartsClass('TM551');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (TM551.isDevice(p)) {
        const data = TM551.getData(p);
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
const TM551 = Obniz.getPartsClass('TM551');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (TM551.isDevice(p)) {
        const data = TM551.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
