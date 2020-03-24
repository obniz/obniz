# iBS01
INGICS BLE tag.

Support device

- iBS01H
- iBS01G

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
obniz.ble.scan.start(null, { duplicate: true, duration: null });
obniz.ble.scan.onfind = (p) => {
    if (IBS01.isDevice(p)) {
        let data = IBS01.getData(p);
        console.log(data);
    }
};
```

## getData(BleRemotePeripheral)

Returns device information if found. Returns Null if not found.

- battery : Battery voltage
- button : True when button is pressed
- moving : True when moving
- hall_sensor : True when the magnet approaches
- fall : True when falling


```javascript
// Javascript Example
let IBS01 = Obniz.getPartsClass('iBS01');
await obniz.ble.initWait();
obniz.ble.scan.start(null, { duplicate: true, duration: null });
obniz.ble.scan.onfind = (p) => {
    if (IBS01.isDevice(p)) {
        let data = IBS01.getData(p);
        console.log(data);
    }
};
```
