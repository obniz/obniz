# iBS04i
beacon made by INGICS.

Support device

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
obniz.ble.scan.start(null, { duplicate: true, duration: null });
obniz.ble.scan.onfind = (p) => {
    if (IBS04I.isDevice(p)) {
        let data = IBS04I.getData(p);
        console.log(data);
    }
};
```

## getData(BleRemotePeripheral)

Returns device information if found. Returns Null if not found.

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
obniz.ble.scan.start(null, { duplicate: true, duration: null });
obniz.ble.scan.onfind = (p) => {
    if (IBS04I.isDevice(p)) {
        let data = IBS04I.getData(p);
        console.log(data);
    }
};
```
