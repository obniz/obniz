# MH_Z19B


CO2 concentration sensor output through the UART.

This sensor needs to be heated. The value will not be stable for about 3 minutes after heating.

After the module works for some time, it can judge the zero point intelligently and do the zero calibration
automatically. The calibration cycle is every 24 hours since the module is power on. The zero point is 400ppm. If you want to use it indoors, it is recommended to turn off the auto-calibration using the `setDetectionRange()` function.

Please see the [datasheet](https://www.winsen-sensor.com/d/files/infrared-gas-sensor/mh-z19b-co2-ver1_0.pdf) for more details.


## wired(obniz,  { sensor_tx, sensor_rx [,vcc, gnd]});

name | type | required | default | description
--- | --- | --- | --- | ---
sensor_tx | `number(obniz Board io)` | yes | &nbsp; | tx pin on the sensor
sensor_rx | `number(obniz Board io)` | yes | &nbsp; | rx pin on the sensor
vcc | `number(obniz Board io)` | no | &nbsp; | vcc pin (v+ pin)
gnd |`number(obniz Board io)` | no | &nbsp; | gnd pin

```Javascript
// Javascript Example
var sensor = obniz.wired("MH_Z19B", {vcc:0, gnd:1, sensor_tx:2, sensor_rx:3});
await sensor.heatWait();
obniz.repeat(async()=>{
  console.log(await sensor.getWait());
}, 10000);
```


## [await] heatWait(sec: number)
Start heating and waits until the time elapses. You can change the waiting time from the default of 3 minutes by specifying an argument (more than 3 minutes recommended).  
Be sure to run this function before running any other functions.

name | type | required | default | description
--- | --- | --- | --- | ---
sec | `number` | no | 180 | waiting time

```Javascript
// Javascript Example
var sensor = obniz.wired("MH_Z19B", {vcc:0, gnd:1, sensor_tx:2, sensor_rx:3});
await sensor.heatWait();
console.log(await sensor.getWait());
```

## [await] getWait()
Get the sensor value through UART.  
If no response from the sensor, `undefined is returned.

```Javascript
// Javascript Example
var sensor = obniz.wired("MH_Z19B", {vcc:0, gnd:1, sensor_tx:2, sensor_rx:3});
await sensor.heatWait();
obniz.repeat(async()=>{
  console.log(await sensor.getWait());
}, 10000);
```

## calibrateZero()
Do zero calibration. This is to improve the accuracy out of doors (400ppm) environment.  
Run this function after running the sensor for at least 20 minutes out of doors (400ppm environment).

```Javascript
// Javascript Example
var sensor = obniz.wired("MH_Z19B", {vcc:0, gnd:1, sensor_tx:2, sensor_rx:3});
await sensor.heatWait();
setTimeout(sensor.calibrateZero(), 1200000);
```

## calibrateSpan(ppm: number)

name | type | required | default | description
--- | --- | --- | --- | ---
ppm | `number` | no | 2000 | CO2 concentration(ppm)

Do span calibration. This is to improve the accuracy in a 1000-2000ppm environment.    
Run this function after running the sensor for at least 20 minutes in an environment of about 2000ppm (1000ppm or higher recommended). You can change the CO2 concentration setting by setting the argument, but if the argument is less than 1000ppm, it will not be executed.  
Also, Please be sure to do the zero calibration before the span calibration.

```Javascript
// Javascript Example
var sensor = obniz.wired("MH_Z19B", {vcc:0, gnd:1, sensor_tx:2, sensor_rx:3});
await sensor.heatWait();
setTimeout(sensor.calibrateZero(), 1200000);
setTimeout(sensor.calibrateSpan(), 1200000);
```

## setAutoCalibration(autoCalibration: boolean)

name | type | required | default | description
--- | --- | --- | --- | ---
autoCalibration | `boolean` | no | true | ON / OFF


Set the automatic calibration ON/OFF. It is set to ON by default at the factory, and the minimum value of 400ppm is calibrated every 24 hours.  
For indoor use, it is recommended to turn off the automatic calibration from this function.

```Javascript
// Javascript Example
var sensor = obniz.wired("MH_Z19B", {vcc:0, gnd:1, sensor_tx:2, sensor_rx:3});
await sensor.heatWait();
sensor.setAutoCalibration(false);
console.log(await sensor.getWait());
```

## setDetectionRange(range: number)

name | type | required | default | description
--- | --- | --- | --- | ---
range | `number` | yes | &nbsp; | the measurement upper limit[2000,5000,10000]

Change the upper limit of the measurement range. The upper limit of the measurement range can be changed by setting the argument to either 2000, 5000, or 10000 ppm.  
If you set any other value as the argument, the upper limit will be automatically set to 5000ppm.


```Javascript
// Javascript Example
var sensor = obniz.wired("MH_Z19B", {vcc:0, gnd:1, sensor_tx:2, sensor_rx:3});
await sensor.heatWait();
sensor.setDetectionRange(5000);
console.log(await sensor.getWait());
```

