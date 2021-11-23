# TM511

BLEで利用できる加速度センサーです。

![](image.jpg)

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

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

advertisementがTM511のものであった場合その中身からデータを読み取ります

- x,y,z 加速度データ
- battery 電池残量

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
