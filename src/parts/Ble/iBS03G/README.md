# iBS03G

Waterproof acceleration by INGICS.

Support device

- iBS03G

![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const IBS03G = Obniz.getPartsClass('iBS03G');
```

## isDevice(BleRemotePeripheral)

Returns true if a device was found.

```javascript
// Javascript Example
const IBS03G = Obniz.getPartsClass('iBS03G');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS03G.isDevice(p)) {
        let data = IBS03G.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getData(BleRemotePeripheral)

Returns device information if found. Returns Null if not found.

- battery : Battery voltage
- button : True when button is pressed
- moving : True when moving


```javascript
// Javascript Example
const IBS03G = Obniz.getPartsClass('iBS03G');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS03G.isDevice(p)) {
        let data = IBS03G.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
