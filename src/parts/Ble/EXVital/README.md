# EXVital

Wearable activity meter for BLE communication made by WHERE


## Data acquisition

Get advertised data about once every 10 seconds

- major: iBeacon major
- minor: iBeacon minor
- power: iBeacon power
- diastolic_pressure: diastolic pressure
- systolic_pressure: systolic pressure
- arm_temp: arm temp
- body_temp: body temp
- heart_rate: heart rate
- battery: battery voltage
- steps: number of steps

```javascript
// Javascript Example
const EXVital = Obniz.getPartsClass('EXVital');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (EXVital.isDevice(p)) {
        const device = new EXVital(p);
        const data = device.getData();
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

or

```javascript
// Javascript Example
const EXVital = Obniz.getPartsClass('EXVital');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (EXVital.isDevice(p)) {
        const data = EXVital.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
