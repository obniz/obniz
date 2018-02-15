# Temperature Sensor - SHT31
Temperature and Humidity sensor SHT31

## wired(obniz,  { io_vcc, io_sda, io_scl, io_gnd, io_addr, addressmode} )
the address of SHT31 can be choosed from 0x44,0x45.
Please provide 4 for 0x44. 5 for 0x45 to addressmode.
(SHT31 read ADDR value to define it's address. 0 is 0x45.)
```javascript
var sensor = obniz.wired("SHT31", {vcc : 0, sda:2, scl:3, gnd:1, addr:4, addressmode:5);
```
## [await] getTempWait()
Get a temperature. Unit is Celsius.

## [await] getHumdWait()
Get a Humidity. Unit is Ratio(%).
```javascript
var sensor = obniz.wired("SHT31", {vcc : 0, sda:2, scl:3, gnd:1, addr:4, addressmode:5);
var temp = await sensor.getTemp();
var humd = await sensor.getHumd();
console.log('temperature:' + temp);
console.log('humidity:' + humd);
```