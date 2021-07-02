# Logtta_Accel

Accelerometer by UNI-ELECTRONICS

Official product introduction page is [here](http://www.uni-elec.co.jp/logtta_page.html)

It corresponds only when switching to beacon mode with Android app in the introduction page.

![](image.jpg)

## Available modes

- Beacon mode

## Beacon data (getData())

- battery: Battery Level (%)
- sequence: Sequence number
- revision: Module version
- name: Module name
- setting
    - temp_cycle: Temperature and humidity measurement cycle (sec)
    - accel_sampling: Acceleration sampling frequency (Hz)
    - hpf: Hypasal filter
    - accel_range: Acceleration range (G)
    - accel_axis: Acceleration measuring axis (X/Y/Z)
    - accel_resolution: Acceleration resolution (bit)
- temperature: Temperature (℃)
- humidity: Humidity (%)
- alert: Occurrence of alerts for the past four times
- accel_peak: Acceleration peak data
- accel_rms: Acceleration RMS data

## Use case

```javascript
// Javascript
const Logtta_Accel = Obniz.getPartsClass('Logtta_Accel');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not Logtta_Accel
  const mode = Logtta_Accel.getDeviceMode(peripheral);
  if (mode === 'Beacon') {
    // Generate an instance
    const device = new Logtta_Accel(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```
