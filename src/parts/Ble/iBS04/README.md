# iBS04
beacon advertising device made by INGICS.

Support device

- iBS04

![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const IBS04 = Obniz.getPartsClass('iBS04');
```

## isDevice(BleRemotePeripheral)

Returns true if a device was found.

```javascript
// Javascript Example
const IBS04 = Obniz.getPartsClass('iBS04');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS04.isDevice(p)) {
        let data = IBS04.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getData(BleRemotePeripheral)

Returns device information if found. Returns Null if not found.

- battery : Battery voltage
- button : True when button is pressed


```javascript
// Javascript Example
const IBS04 = Obniz.getPartsClass('iBS04');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS04.isDevice(p)) {
        let data = IBS04.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
