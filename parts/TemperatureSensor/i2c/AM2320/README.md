# Temperature Sensor - AM2320
Temperature and Humidity sensor AM2320.

![](./image.jpg)

## wired(obniz,  {vcc, sda, gnd, scl} )

Connect a sensor to an obniz.
When connected as shown, 0, 1, 2, and 3 are connected to the temperature sensor's SCL, GND, SDA, and VCC pins. The contact may be poor because the sensor pin is thin. In that case, it is better to use a breadboard.

![](./wired.jpg)

```javascript
// Javascript Example
var sensor = obniz.wired("AM2320", { vcc: 3, sda: 2, gnd: 1, scl: 0 });
```

## [await] getAllWait()

Get all the values.

- temperature: Celsius temperature
- humidity: %

The sampling interval of AM2320 needs 2 seconds or more.
Since we need to wait more than 2 seconds at initialization, here we wait for 2 seconds with `obniz.wait (2000);`.

```javascript
// Javascript Example
var sensor = obniz.wired("AM2320", { vcc: 3, sda: 2, gnd: 1, scl: 0 });
obniz.wait(2000); //Since the sampling interval of AM2320 requires 2 seconds or more, it is necessary to wait 2 seconds or more at initialization as well.
const obj = await sensor.getAllWait();
console.log('temp: ' + obj.temperature + ' degree');
console.log('humidity: ' + obj.humidity + ' %');
```

If you want to measure continuously, use `setInterval`.

```javascript
// Javascript Example
var sensor = obniz.wired("AM2320", { vcc: 3, sda: 2, gnd: 1, scl: 0 });
setInterval(async function () {
  const obj = await sensor.getAllWait();
  console.log('temp: ' + obj.temperature + ' degree');
  console.log('humidity: ' + obj.humidity + ' %');
}, 2500);
```

## [await] getTempWait()

Measure and return the current temperature. The unit is Celsius (°C).

```javascript
// Javascript Example
var sensor = obniz.wired("AM2320", { vcc: 3, sda: 2, gnd: 1, scl: 0 });
obniz.wait(2000);
const temp = await sensor.getTempWait();
console.log('temp: ' + temp + ' degree');
```

## [await] getHumdWait()

Measure and return the current humidity. The unit is %.

```javascript
// Javascript Example
var sensor = obniz.wired("AM2320", { vcc: 3, sda: 2, gnd: 1, scl: 0 });
obniz.wait(2000);
const humd = await sensor.getHumdWait();
console.log('humd: ' + humd + ' %');
```
