# CCS811

This sensor measures total volatile organic compounds (TVOC) and their calculated carbon dioxide equivalent (eCO2).

- Total Volatile Organic Compounds (TVOC): 0 to 1,187 ppb
- eCO2: 400 to 8,192 ppm

Also, this sensor needs to be aged before use. See the manufacturer's datasheet for details.

## wired(obniz, { vcc, gnd, do, ao});

name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no | &nbsp; | Connect to vcc for a module, or to H for a stand-alone power supply. If the module is connected to another power supply, it is not necessary to specify.
gnd | `number(obniz Board io)` | no | &nbsp; | gnd if it is a module, or connects to H if it is a stand-alone device. If the module is connected to another power supply, it is not necessary to specify.
scl | `number(obniz Board io)` | no | &nbsp; | The IO of the obniz connected to the scl of I2C.
sda | `number(obniz Board io)` | no | &nbsp; | the IO of obniz connected to the I2C sda
nwak | `number(obniz Board io)` | no | &nbsp; | the IO of obniz connected to the nwak terminal of the sensor
nwak | `number(obniz Board io)` | no | &nbsp; | the IO of obniz connected to the nwak terminal of the sensor
nrst | `number(obniz Board io)` | no | &nbsp; | the IO of obniz connected to the sensor's nrst terminal
nrst | `number(obniz Board io)` | no | &nbsp; | the IO of obniz connected to the sensor's nrst terminal
nint | `number(obniz Board io)` | no | &nbsp; | the IO of obniz connected to the nint terminal of the sensor
i2c | `number(obniz Board io)` | no | &nbsp; | The i2c object of initialized obniz, which, if it exists, takes precedence over scl,sda.
add | `number(obniz Board io)` | no | &nbsp; | the addressing terminal. The IO of the connected obniz is specified. If the address is 0x5a, it is output as false, otherwise it is output as true.
If the address is either 0x5b or 0x5a, otherwise it is an error.


```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
await sensor.configWait();
obniz.repeat(async()=>{
  if (await sensor.checkAvailableDataWait()) {
    var data = await sensor.readAlgorithmResultsWait();
    console.log(data.TCOC, data.eCO2);
  }
})
```

## [await] configWait()

Configure the initial settings for the sensor, which will start in 1-second measurement mode.

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
await sensor.configWait();
obniz.repeat(async()=>{
  if (await sensor.checkAvailableDataWait()) {
    var data = await sensor.readAlgorithmResultsWait();
    console.log(data.TCOC, data.eCO2);
  }
})

```

## [await] setDriveModeWait(mode)

DRIVE_MODE is set to 1 by default by configWait().

- 0: Idle
- 1: Every 1 second
- 2: Every 10 seconds
- 3: Every 60 seconds
- 4: raw mode

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
await sensor.configWait();
obniz.repeat(async()=>{
  if (await sensor.checkAvailableDataWait()) {
    var data = await sensor.readAlgorithmResultsWait();
    console.log(data.TCOC, data.eCO2);
  }
})
```

## [await] setEnvironmentalDataWait(humidity, temperature)

Temperature and humidity are sent for sensor calibration.
It can be set to the values of nearby temperature and humidity sensors for higher accuracy.

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
await sensor.configWait();
await sensor.setEnvironmentalDataWait(50.1, 25.5); // 50.1%, 25.5 degree
obniz.repeat(async()=>{
  if (await sensor.checkAvailableDataWait()) {
    var data = await sensor.readAlgorithmResultsWait();
    console.log(data.TCOC, data.eCO2);
  }
})

```

## [await] checkAvailableDataWait()

Checks for availability of measurements.

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
await sensor.configWait();
obniz.repeat(async()=>{
  if (await sensor.checkAvailableDataWait()) {
    var data = await sensor.readAlgorithmResultsWait();
    console.log(data.TCOC, data.eCO2);
  }
})
```

## [await] readAlgorithmResultsWait()

Get TVOC and eCO2.

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
await sensor.configWait();
obniz.repeat(async()=>{
  if (await sensor.checkAvailableDataWait()) {
    var data = await sensor.readAlgorithmResultsWait();
    console.log(data.TCOC, data.eCO2);
  }
})

```

## wake()

Use nwak to recover from sleep, nwak needs to be specified as wired.

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
sensor.sleep();
await obniz.wait(1000);
sensor.wake();
```

## sleep()

Use nwak to sleep. nwak needs to be specified as wired.

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
sensor.sleep();
```


## [await] hwResetWait()

Resets the sensor with a reset pin; nrst must be specified as wired.

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
await sensor.configWait();
var data = await sensor.readAlgorithmResultsWait();
console.log(data.TCOC, data.eCO2);
await sensor.hwResetWait();
await sensor.configWait();
data = await sensor.readAlgorithmResultsWait();
console.log(data.TCOC, data.eCO2);
```
