# AK8963

This is a 3-axis magnetic sensor


![](./image.jpg)

## wired("AK8963", { [gnd , vcc , sda , scl , i2c, address]})

3.3V power supply is not supported by obniz Board, so need to get another way.

```javascript
var sensor = obniz.wired("AK8963", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
```

## setConfig(ADC_cycle)

Initial settings of AK8963.

- ADC_cycle
You can choose from 8, 100 [Hz].

8 [Hz]: Although the amount of data is small, the value becomes more stable.
100 [Hz]: More data can be measured.

```javascript
var sensor = obniz.wired("AK8963", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
sensor.setConfig(8);
```


## [await] getWait()

Return compass data.

```javascript
var sensor = obniz.wired("AK8963", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getWait();
console.log('compass: %o', data);
```
