# TM551

BLEで利用できる加速度センサーです。

![](image.jpg)

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

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

advertisementがTM551のものであった場合その中身からデータを読み取ります

- x,y,z 加速度データ
- battery 電池残量

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
