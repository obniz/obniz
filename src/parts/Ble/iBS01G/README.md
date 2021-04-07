# iBS01G
INGICS BLE tag.

Moving and falling by INGICS.

- iBS01G


## getPartsClass(name)

```javascript
// Javascript Example
const IBS01G = Obniz.getPartsClass('iBS01G');
```

## isDevice(BleRemotePeripheral)

Returns true if a device was found.

```javascript
// Javascript Example
let IBS01G = Obniz.getPartsClass('iBS01G');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS01G.isDevice(p)) {
        let data = IBS01G.getData(p);
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
- fall : True when falling


```javascript
// Javascript Example
let IBS01G = Obniz.getPartsClass('iBS01G');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS01G.isDevice(p)) {
        let data = IBS01G.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
