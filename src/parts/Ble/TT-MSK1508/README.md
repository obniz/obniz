# Drip navi sensor

This is a drip flowmeter with BLE communication manufactured by tri-tech.

![](./image.jpg)

## Get the data
Extract the data from an advertisement.


Result format:
```
{
  patientId: Patient id;
  operatingMode: Operating mode;
  flowRateStatus: Flow rate status;
  batteryStatus: Battery status;
  model: Mode;
  totalDoseVolume: Total dose volume (mL);
  totalDoseTime: Total doze time (minutes);
  infusionType: Infusion type;
  sensorId: Sensor id;
  errors: Error info;
  battery: Battery level (%);
}
```


```javascript
// Javascript Example
const TT_MSK1508 = Obniz.getPartsClass('TT_MSK1508');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
  if (TT_MSK1508.isDevice(p)) {
    const data = TT_MSK1508.getData(p);
    console.log(data);
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
