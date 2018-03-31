# Temperature Sensor - ADT7310
Temperature and Humidity sensor ADT7310

## wired(obniz, {vcc, gnd, sda, scl, addr, addressMode})
the address of ADT7310 can be choosed from 0x48,0x49.
Please provide 8 for 0x48. 9 for 0x49 to addressmode.
```javascript
// Javascript Example
var sensor = obniz.wired("ADT7410", {vcc:0, gnd:2, sda:3, scl:8, addressMode:8});
```
## [await] getTempWait()
Get a temperature. Unit is Celsius.

```javascript
// Javascript Example
var sensor = obniz.wired("ADT7410", {vcc:0, gnd:2, sda:3, scl:8,  addressMode:8});
var temp = await sensor.getTemp();
console.log('temperature:' + temp);
```
