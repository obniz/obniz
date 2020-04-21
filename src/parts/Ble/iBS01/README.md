# iBS01
INGICS BLE tag.

Support device

- iBS01H: Door open/close sensor using hall sensor
- iBS01G: Moving and falling detection sensor

![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const IBS01 = Obniz.getPartsClass('iBS01');
```

## isDevice(BleRemotePeripheral)

Returns true if a device was found.

```javascript
// Javascript Example
let IBS01 = Obniz.getPartsClass('iBS01');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS01.isDevice(p)) {
        let data = IBS01.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## getData(BleRemotePeripheral)

Returns device information if found. Returns Null if not found.

- battery : Battery voltage
- hall_sensor : True when the magnet approaches(iBS01H)
- moving : True when moving(iBS01G)
- fall : True when falling(iBS01G)


```javascript
// Javascript Example
let IBS01 = Obniz.getPartsClass('iBS01');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (IBS01.isDevice(p)) {
        let data = IBS01.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
