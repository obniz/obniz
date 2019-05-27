# Temperature Sensor - SHT31
Temperature and Humidity sensor SHT31

![](./image.jpg)

## wired(obniz,  {vcc , sda, scl, adr, gnd, addressmode} )
the address of SHT31 can be choosed from 0x44,0x45.
Please provide 4 for 0x44. 5 for 0x45 to addressmode.
(SHT31 read ADDR value to define it's address. 0 is 0x45.)
```javascript
// Javascript Example
var sensor = obniz.wired("SHT31", {vcc : 0, sda:1, scl:2, adr:3, gnd:4, addressmode:5});
```
## [await] getTempWait()
Get a temperature. Unit is Celsius.

## [await] getHumdWait()
Get a Humidity. Unit is Ratio(%).
```javascript
// Javascript Example
var sensor = obniz.wired("SHT31", {vcc : 0, sda:1, scl:2, adr:3, gnd:4, addressmode:5});
var temp = await sensor.getTempWait();
var humd = await sensor.getHumdWait();
console.log('temperature:' + temp);
console.log('humidity:' + humd);
```