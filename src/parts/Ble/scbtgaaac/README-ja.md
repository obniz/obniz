# SCBTGAAAC

ABLIC社製の漏水センサーです。 電池不要で、水が触れることで発電しビーコンを発信します。

![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const DEVICE = Obniz.getPartsClass('SCBTGAAAC');
```

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
const DEVICE = Obniz.getPartsClass('SCBTGAAAC');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (DEVICE.isDevice(p)) {
        let name = DEVICE.getData(p);
        console.log(name);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getData(BleRemotePeripheral)

発見した場合にデバイスの名前を返します。発見できなかった場合にはNullを返します。

```javascript
// Javascript Example
const DEVICE = Obniz.getPartsClass('SCBTGAAAC');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (DEVICE.isDevice(p)) {
        let name = DEVICE.getData(p);
        console.log(name);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
