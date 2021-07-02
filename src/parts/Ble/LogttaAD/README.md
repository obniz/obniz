# Logtta_AD

CO2 concentration sensor by UNI-ELECTRONICS

Official product introduction page is [here](http://www.uni-elec.co.jp/logtta_page.html)

![](image.jpg)

## Available modes

- Beacon mode
- Connectable mode

## Beacon data (getData())

- battery: Battery level (%) or USB power supply (254)
- ampere: Ampere (mA) (4\~20)
- volt: Voltage (mV) (1000\~5000)
- count: Contact input counter
- interval: Transmission interval (sec)

## Connected data (getDataWait())

- ampere: Ampere (mA) (4\~20)
- volt: Voltage (mV) (1000\~5000)
- count: Contact input counter

## Use case (Beacon mode)

```javascript
// Javascript
const Logtta_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not Logtta_AD
  const mode = Logtta_AD.getDeviceMode(peripheral);
  if (mode === 'Beacon') {
    // Generate an instance
    const device = new Logtta_AD(peripheral, mode);
    // Get data and output to the console
    console.log(device.getData());
  }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## Use case (Connectable mode)

### Connect then get data & battery remaining once

Use `batteryService.getBatteryLevelWait()` to get battery levels.

When the value is 254, the USB power supply is driven, otherwise the remaining amount is returned in percentages.

```javascript
// Javascript
const Logtta_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not Logtta_AD
  const mode = Logtta_AD.getDeviceMode(peripheral);
  if (mode === 'Connectable') {
    // Generate an instance
    const device = new Logtta_AD(peripheral, mode);
    console.log(`Connecting to Logtta_AD[${device.address}]`);

    // Connect to the device
    await device.connectWait();
    console.log(`Connected to Logtta_AD[${device.address}]`);

    // Get data from the device
    const data = await device.getDataWait();
    console.log(`Logtta_AD[${device.address}]: ${data.ampere}mA`);
    console.log(`Logtta_AD[${device.address}]: ${data.volt}mV`);
    console.log(`Logtta_AD[${device.address}]: ${data.count} time(s)`);

    if (device.batteryService) {
      // Get battery level from the device
      const batteryLevel = await device.batteryService.getBatteryLevelWait();
      // Output 'USB power supply' at 254
      if (batteryLevel === 254)
        console.log(`Logtta_AD[${device.address}]: USB power supply`);
      // Output battery remaining amount when other than 254
      else
        console.log(`Logtta_AD[${device.address}]: BatteryLevel ${batteryLevel}%`);
    }

    // Disconnect from the device
    await device.disconnectWait();
    console.log(`Disconnected from Logtta_AD[${device.address}]`);
  }
};
await obniz.ble.scan.startWait();
```

### Connect then regularly get data

Use `startNotifyWait()` to wait for data from the device always.

```javascript
// Javascript
const Logtta_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not Logtta_AD
  const mode = Logtta_AD.getDeviceMode(peripheral);
  if (mode === 'Connectable') {
    // Generate an instance
    const device = new Logtta_AD(peripheral, mode);
    console.log(`Connecting to Logtta_AD[${device.address}]`);

    // Connect to the device
    await device.connectWait();
    console.log(`Connected to Logtta_AD[${device.address}]`);

    // Start waiting for data from the device
    device.startNotifyWait((data) => {
      console.log(`Logtta_AD[${device.address}]: ${data.ampere}mA`);
      console.log(`Logtta_AD[${device.address}]: ${data.volt}mV`);
      console.log(`Logtta_AD[${device.address}]: ${data.count} time(s)`);
    });
  }
};
await obniz.ble.scan.startWait();
```

### Connect then activate beacon mode

Use `setBeaconModeWait()` to  control the valid invalidity of the mode that periodically disseminates beacons.

Disconnecting after setting it is effective.

Before need use `authPinCodeWait()` to authenticate with the device. (Default authentication code: 0000)

To disable beacon mode, it is necessary to press and hold the button on the device for more than 2 seconds.

```javascript
// Javascript
const Logtta_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (peripheral) => {
  // Get operation mode, it becomes null when not Logtta_AD
  const mode = Logtta_AD.getDeviceMode(peripheral);
  if (mode === 'Connectable') {
    // Generate an instance
    const device = new Logtta_AD(peripheral, mode);
    console.log(`Connecting to Logtta_AD[${device.address}]`);

    // Connect to the device
    await device.connectWait();
    console.log(`Connected to Logtta_AD[${device.address}]`);

    // Send authentication code
    await device.authPinCodeWait(0000);
    console.log(`Logtta_AD[${device.address}]: Sent auth pin code`);

    // Enable beacon mode
    await device.setBeaconModeWait(true);
    console.log(`Logtta_AD[${device.address}]: Enabled beacon mode`);

    // Disconnect from the device
    await device.disconnectWait();
    console.log(`Disconnected from Logtta_AD[${device.address}]`);
  }
};
await obniz.ble.scan.startWait();
```
