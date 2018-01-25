# Temperature Sensor - ADT7310
Temperature and Humidity sensor ADT7310

## wired(obniz, io_vcc, io_sda, io_scl, io_gnd, io_addr, addressmode)
the address of ADT7310 can be choosed from 0x48,0x49.
Please provide 8 for 0x48. 9 for 0x49 to addressmode.
```javascript
var sensor = obniz.wired("ADT7310", 0, 2, 3, 8);
```
## [await] getTempWait()
Get a temperature. Unit is Celsius.

```javascript
var sensor = obniz.wired("ADT7310", 0, 1, 2, 3, 8);
var temp = await sensor.getTemp();
console.log('temperature:' + temp);
```
