# VitalBand

Wearable activity meter for BLE communication.

![](./image.jpg)

## Data acquisition

Get advertised data about once every 10 seconds

- SN: serial number
- heart_rate: heart rate
- body_temp: body temperature(℃)
- blood_pleasure_high: blood pressure high
- blood_pleasure_low: Blood pressure low
- Sp02: saturation of percutaneous oxygen
- battery: battery (%)
- steps: pedometer

<br>

```javascript
// Javascript Example
const VitalBand = Obniz.getPartsClass('VitalBand');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
    if (VitalBand.isDevice(peripheral)) {
        const device = new VitalBand(peripheral);
        const data = device.getData();
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```