# TM2101-SR

Temperature patch sensor made by Maxel

When the light is detected from the bag, it starts and keeps measuring body temperature.

Capable of storing up to 5184 data pairs

## Available modes

- Connectable mode

## Beacon data (getData())

- serial: serial no.
- interval: measurement interval (min)
- temperature: measured body temperature (℃)
- elapsed_time: elapsed time from startup (sec)
- reset_reason: due to last reset
- battery: battery voltage (only 1.35 indicates under 1.4)
- full: data space availability
- interval_determining_method: method of determining the measurement interval

## Connected data (getDataWait())

- data: associative array of measured body temperature (°C) in UNIX time (sec)
- elapsed_time: elapsed time (sec) from startup to final measurement

## How to use

```javascript
const TM2101_SR = Obniz.getPartsClass('TM2101_SR');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (TM2101_SR.isDevice(peripheral)) {
    console.log('find');
    const device = new TM2101_SR(peripheral);

    // Beacon data
    const advDataResult = device.getData();
    console.log(advDataResult);

    device.ondisconnect = (reason) => {
      console.log(reason)
    };
    await device.connectWait();
    console.log('connected');

    // Connected data (Stored data)
    const dataResult = await device.getDataWait();
    console.log(dataResult);

    await device.disconnectWait();
  }
};
await obniz.ble.scan.startWait();
```

## Various settings

You can update the settings with `setConfigWait()`.
The following initial values are used for the omitted items.

Warning: All recorded data will be deleted.

```javascript
const TM2101_SR = Obniz.getPartsClass('TM2101_SR');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (TM2101_SR.isDevice(peripheral)) {
    console.log('find');
    const device = new TM2101_SR(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason)
    };
    await device.connectWait();
    console.log('connected');

    const result = await device.setConfigWait({
      // First measurement interval [min] (1~60) (Initial value: 1)
      first_interval: 1,
      // Transition time to the second measurement interval [hour] (0~24) (Initial value: 24)
      transition_time_to_second: 24,
      // Second measurement interval [min] (1~60) (Initial value: 5)
      second_interval: 5,
      // Body temperature changing to 1 minute interval [℃] (25.000~41.000) (Initial value: 37.5)
      temperature: 37.5,
      // Body temperature difference moving to 1 minute interval [℃] (0.125~2.000) (Initial value: 0.5)
      temperature_difference: 0.5,
    });
    console.log('setConfigWait', result);
  }
};
await obniz.ble.scan.startWait();
```

## Switch to the hibernation mode

You can use `hibernateWait()` to switch to the factory hibernation mode.
After the transition, the connection is automatically disconnected.

Warning: All recorded data will be deleted.

```javascript
const TM2101_SR = Obniz.getPartsClass('TM2101_SR');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (TM2101_SR.isDevice(peripheral)) {
    console.log('find');
    const device = new TM2101_SR(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason);
      console.log('hibernated');
    };
    await device.connectWait();
    console.log('connected');

    await device.hibernateWait();
  }
};
await obniz.ble.scan.startWait();
```
