# Temperature Sensor - SHT31
Temperature and Humidity sensor SHT31

![](image.jpg)

## wired(obniz,  {vcc , sda, scl, adr, gnd, addressmode, address} )
the address of SHT31 can be choosed from 0x44,0x45.
Please provide 4 for 0x44. 5 for 0x45 to addressmode.
(SHT31 read ADDR value to define it's address. 0 is 0x45.)
```javascript
// Javascript Example
var sensor = obniz.wired("SHT31", {vcc : 0, sda:1, scl:2, adr:3, gnd:4, addressmode:5});
```

use address

```javascript
// Javascript Example
var sensor = obniz.wired("SHT31", {vcc:0, sda:1, scl:2, gnd:4, address:0x44});
```

## [await] getTempWait()
Get a temperature. Unit is Celsius.

```javascript
// Javascript Example
var sensor = obniz.wired("SHT31", {vcc:0, sda:1, scl:2, adr:3, gnd:4, addressmode:5});
var temp = await sensor.getTempWait();
console.log('temperature:' + temp);
```

## [await] getHumidWait()
Get a Humidity. Unit is Ratio(%).

```javascript
// Javascript Example
var sensor = obniz.wired("SHT31", {vcc:0, sda:1, scl:2, adr:3, gnd:4, addressmode:5});
var humd = await sensor.getHumidWait();
console.log('humidity:' + humd);
```

## [await] getAllWait()
Get temperature and Humidity.

```javascript
// Javascript Example
var sensor = obniz.wired("SHT31", {vcc:0, sda:1, scl:2, adr:3, gnd:4, addressmode:5});
var data = await sensor.getAllWait();
console.log('humidity:' + data.temperature);
console.log('temperature:' + data.humidity);
```