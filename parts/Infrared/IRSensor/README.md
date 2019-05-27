# IRSensor

Detecting Infrared signal like a remote controller's signal.

![](./image.jpg)

## wired(obniz, {output [vcc, gnd]})

Connect vcc and gnd and output. vcc and gnd is optional.

Various parts can be used. Belows are example.

1. [OSRB38C9AA](http://akizukidenshi.com/download/OSRB38C9AA.pdf)
1. [TFMS5380](https://www.voti.nl/docs/tfms5360.pdf) etc,,,

These parts has vcc/gnd/output
For examle, 

![](./OSRB38C9AA.jpg)

![](./tfms5380.jpg)

On program use it like

```javascript
// Javascript Example
var sensor = obniz.wired('IRSensor', {vcc:0, gnd:1, output: 2});
```

## start(callback(array))
start monitoring. and set detect callback.

```javascript
// Javascript Example
var sensor = obniz.wired('IRSensor', {vcc:0, gnd:1, output: 2});
sensor.start(function (arr) {
  console.log('detected!!')
  console.log(JSON.stringify(arr));
})
```

arr is same as `obniz.LogicAnalyzer`'s result.
So, It's like below.

```
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0]
```

monitor options and these default value
See more details on logicanalyzer document

property | type | default | description
--- | --- | --- | --- 
dataSymbolLength | `number` | 0.07 (msec) | sampling interval of logicanalyzer
duration | `number` | 500 (msec) | data length
dataInverted | `number` | true | 0,1 of data should be inverted
cutTail | `number` | false | cutting of tail 0. It may affect communication.
output_pullup | `number` | true | pullup to 5v or not of sensor output.

You can chenge these before start.

```javascript
// Javascript Example
var sensor = obniz.wired('IRSensor', {vcc:0, gnd:1, output: 2});
sensor.duration = 150;
sensor.dataInverted = false;
sensor.start(function (arr) {
  console.log('detected!!')
  console.log(JSON.stringify(arr));
})
```

## ondetect = function(array)
set callback after started

```javascript
// Javascript Example
var sensor = obniz.wired('IRSensor', {vcc:0, gnd:1, output: 2});
sensor.start()

sensor.ondetect = function(arr) {
  console.log('detected!!')
  console.log(JSON.stringify(arr));
}
```