# MINEW_S1

Temperature / Humidity beacon made by Shenzhen Minew Technologies Co.
It is necessary to set the beacon output with the dedicated application in advance.

Only supported if HT Sensor / Info is set for any SLOT frame type. Even if iBeacon / UID / URL / TLM is set, this library will not be able to receive data (it will not affect detection).

![](./image.jpg)

## Beacon data (getData())

- batteryLevel: Battery level (%)
- temperature: Probe temperature (℃)
- humidity: Body humidity (%)

## Use case

```javascript
// Javascript
const MINEW_S1 = Obniz.getPartsClass('MINEW_S1');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not MINEW_S1
  const mode = MINEW_S1.getDeviceMode(peripheral);
  if (mode) {
    // Generate an instance
    const device = new MINEW_S1(peripheral, mode);
    // Get data
    const data = device.getData();
    // If there is no temperature / humidity data, data will be null
    if (data) {
      console.log(data);
    }
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## Example of getting Info data

### Info data

- frameType: Frame type
- versionNumber: Version number
- batteryLevel: Battery level (%)
- macAddress: MAC address
- name: Device name

```javascript
// Javascript
await obniz.ble.initWait();
const MINEW_S1 = Obniz.getPartsClass("MINEW_S1");
obniz.ble.scan.onfind = (peripheral) => {
  if (MINEW_S1.getDeviceMode(peripheral)) {
    const data = MINEW_S1.getInfoData(peripheral);
    // If there is no Info data, data will be null
    if (data) {
      console.log(data);
    }
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });

```
