# iBS02PIR

iBS02PIR by INGICS.

Support device

- iBS02PIR

![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const IBS02 = Obniz.getPartsClass('iBS02PIR');
```

## isDevice(BleRemotePeripheral)

Returns true if a device was found.

```javascript
// Javascript Example
const IBS02 = Obniz.getPartsClass('iBS02PIR');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS02.isDevice(p)) {
        let data = IBS02.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getData(BleRemotePeripheral)

Returns device information if found. Returns Null if not found.

- battery : Battery voltage
- event : True when sensor read

```javascript
// Javascript Example
const IBS02 = Obniz.getPartsClass('iBS02PIR');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS02.isDevice(p)) {
        let data = IBS02.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
