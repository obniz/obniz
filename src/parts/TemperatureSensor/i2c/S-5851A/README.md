# Temperature Sensor - SHT31
Temperature and Humidity sensor SHT31

## wired(obniz, {vcc, gnd, sda, scl, gnd, addr0, addr1, addressmode})
the address of SHT31 can be choosed from 0x44,0x45.
Please provide 4 for 0x44. 5 for 0x45 to addressmode.
(SHT31 read ADDR value to define it's address. 0 is 0x45.)
```javascript
// Javascript Example
var sensor = obniz.wired("S5851A", {vcc:0, gnd:2, sda:3, scl:1, addr0:4, addr1:5, addressmode:"A"});
```
## [await] getTempWait()
Get a temperature. Unit is Celsius.

## [await] getHumdWait()
Get a Humidity. Unit is Ratio(%).
```javascript
// Javascript Example
var sensor = obniz.wired("S5851A", {vcc:0, gnd:2, sda:3, scl:1, addr0:4, addr1:5, addressmode:"A"});
var temp = await sensor.getTemp();
var humd = await sensor.getHumd();
console.log('temperature:' + temp);
console.log('humidity:' + humd);
```