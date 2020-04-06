# SCBTGAAAC

ABLIC社製の漏水センサーです。 

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
obniz.ble.scan.start(null, { duplicate: true, duration: null });
obniz.ble.scan.onfind = (p) => {
    if (DEVICE.isDevice(p)) {
        let name = DEVICE.getData(p);
        console.log(name);
    }
};
```

## getData(BleRemotePeripheral)

発見した場合にデバイスの名前を返します。発見できなかった場合にはNullを返します。

```javascript
// Javascript Example
const DEVICE = Obniz.getPartsClass('SCBTGAAAC');
await obniz.ble.initWait();
obniz.ble.scan.start(null, { duplicate: true, duration: null });
obniz.ble.scan.onfind = (p) => {
    if (DEVICE.isDevice(p)) {
        let name = DEVICE.getData(p);
        console.log(name);
    }
};
```
