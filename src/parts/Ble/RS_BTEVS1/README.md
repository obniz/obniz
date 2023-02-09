# RS-BTEVS1

BLE environmental sensor manufactured by Ratoc Systems

The following sensors are built-in.

- Temperature / humidity sensor (SENSIRION SHTC3)
- CO2 sensor (SENSIRION SCD40)
- PM2.5(0.5/1.0/4.0/10.0) sensor (SENSIRION SPS30)

Versions confirmed to work
- 1.0.2
- 1.2.2

## How to use

```javascript
const RS_BTEVS1 = Obniz.getPartsClass('RS_BTEVS1');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
    if (RS_BTEVS1.isDevice(peripheral)) {
        console.log('find');
        const device = new RS_BTEVS1(peripheral);
        device.ondisconnect = (reason) => {
            console.log(reason)
        };
        await device.connectWait();
        console.log('connected');

        device.onButtonPressed = (pressed) => {
            console.log('Button', pressed);
        };

        const dataResult = await device.getDataWait();
        console.log(dataResult);
    }
};
await obniz.ble.scan.startWait();
```

## Various settings

You can check the current settings with `getConfigWait()`.

You can update the settings with `setConfigWait()`.
The following initial values are used for the omitted items.

```javascript
const RS_BTEVS1 = Obniz.getPartsClass('RS_BTEVS1');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (RS_BTEVS1.isDevice(peripheral)) {
    console.log('find');
    const device = new RS_BTEVS1(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason)
    };
    await device.connectWait();
    console.log('connected');

    const config = await device.getConfigWait();

    const result = await device.setConfigWait({
      tempInterval: 10000, // Temperature notification interval [ms] (10,000~3,600,000)
      pm2_5Interval: 10000, // PM2.5 notification interval [ms] (10,000~3,600,000)
      co2Interval: 10000, // CO2 notification interval [ms] (10,000~3,600,000)
      tempMeasureOperation: false, // Temperature sensor measurement operation setting
      pm2_5MeasureOperation: false, // PM2.5 sensor measurement operation setting
      co2MeasureOperation: false, // CO2 sensor measurement operation setting
      ledDisplay: 'Disable', // Display setting for 10 LEDs (Disable | PM2.5 | CO2)
      advertisementBeacon: false, // Advertisement Beacon Settings
      pm2_5ConcentrationMode: 'Number' // PM2.5 mass concentration / number concentration mode setting (Mass | Number)　This option does not work with firmware version 1.1 or later.
    });
  }
};
await obniz.ble.scan.startWait();
```

## In beacon mode

If you connect in advance and set `advertisementBeacon: true`, you can get a rough value every 3 minutes without connecting.

- CO2 [ppm]
- PM1.0 [ug/m3]
- PM2.5 [ug/m3]
- PM4.0 [ug/m3]
- PM10.0 [ug/m3]
- Temperature [℃]
- Humidity [%]

```javascript
const RS_BTEVS1 = Obniz.getPartsClass('RS_BTEVS1');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (RS_BTEVS1.isDevice(peripheral)) {
    const data = RS_BTEVS1.getData(peripheral);
    console.log(data);
  }
};
await obniz.ble.scan.startWait();
```
