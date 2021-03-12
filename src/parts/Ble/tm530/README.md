# TM530

BLE enabled acceleration sensor.

![](image.jpg)

## isDevice(BleRemotePeripheral)

Returns true if a device was found.

```javascript
// Javascript Example
const TM530 = Obniz.getPartsClass('TM530');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (TM530.isDevice(p)) {
        const data = TM530.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getData(BleRemotePeripheral)

Reading a acceleration data from BLE advertisement

- battery Battery Level
- temperature: Temperature
- humidity: Humidity

```javascript
// Javascript Example
const TM530 = Obniz.getPartsClass('TM530');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (TM530.isDevice(p)) {
        const data = TM530.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
