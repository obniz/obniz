# TM530

BLEで利用できる温度・湿度センサーです

![](image.jpg)

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

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

advertisementがTM530のものであった場合その中身からデータを読み取ります

- battery 電池残量
- temperature: 温度
- humidity: 湿度

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
