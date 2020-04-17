# iBS04i
BLEを利用しビーコンを発信するデバイスです。

- iBS04i

![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const IBS04I = Obniz.getPartsClass('iBS04i');
```

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
const IBS04I = Obniz.getPartsClass('iBS04i');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS04I.isDevice(p)) {
        let data = IBS04I.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getData(BleRemotePeripheral)

発見した場合にデバイスの情報を返します。発見できなかった場合にはNullを返します。

- battery : バッテリの電圧
- button : Button を押したとき true
- uuid : iBeacon　UUID
- major : iBeacon　major
- minor : iBeacon　minor
- power : iBeacon　power
- rssi : 電波強度

```javascript
// Javascript Example
const IBS04I = Obniz.getPartsClass('iBS04i');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS04I.isDevice(p)) {
        let data = IBS04I.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
