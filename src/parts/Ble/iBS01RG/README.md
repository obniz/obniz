# iBS01RG

Acceleration by INGICS.

Support device

- iBS01RG

![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const IBS01RG = Obniz.getPartsClass('iBS01RG');
```

## isDevice(BleRemotePeripheral)

Returns true if a device was found.

```javascript
// Javascript Example
const IBS01RG = Obniz.getPartsClass('iBS01RG');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS01RG.isDevice(p)) {
        let data = IBS01RG.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getData(BleRemotePeripheral)

Returns device information if found. Returns Null if not found.

- battery : Battery voltage
- button : button status
- active : active status
- acceleration : acceleration array

```javascript
// Javascript Example
const IBS01RG = Obniz.getPartsClass('iBS01RG');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS01RG.isDevice(p)) {
        let data = IBS01RG.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
