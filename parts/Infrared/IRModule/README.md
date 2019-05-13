# IRModule

Detecting and sending Infrared signal like a remote controller's signal.

![](./image.jpg)

## wired(obniz, { send, recv[, vcc, gnd]})

Connect send, recv,  vcc and gnd. vcc and gnd is optional.

 
```javascript
// Javascript Example
var module = obniz.wired('IRModule', { vcc: 0, send: 1, recv: 2, gnd: 3 });
```


## start(callback(array))
start monitoring. and set detect callback.


```javascript
// Javascript Example
var module = obniz.wired('IRModule', { vcc: 0, send: 1, recv: 2, gnd: 3 });
module.start(function (arr) {
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
var module = obniz.wired('IRModule', { vcc: 0, send: 1, recv: 2, gnd: 3 });
module.duration = 150;
module.dataInverted = false;
module.start(function (arr) {
  console.log('detected!!')
  console.log(JSON.stringify(arr));
})
```


## ondetect = function(array)
set callback after started

```javascript
// Javascript Example
var module = obniz.wired('IRModule', { vcc: 0, send: 1, recv: 2, gnd: 3 });
module.start()

module.ondetect = function(arr) {
  console.log('detected!!')
  console.log(JSON.stringify(arr));
}
```


## send(array)
send a array of signal.
data baud rate is defined in dataBaud(default 70usec)

This function use `pwm.modulate`. see more dtail on pwm document.

You can record your remote controller's signal by `start(callback)` function.

```Javascript
// Javascript Example
// Example: Turn on KOIZUMI's Room Lamp
var module = obniz.wired('IRModule', { vcc: 0, send: 1, recv: 2, gnd: 3 });
module.send([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1])
```


## dataSymbolLength
baudrate of signal array.
default is 70usec(0.07)
See more dtail on pwm modulate document.

```Javascript
// Javascript Example
var module = obniz.wired('IRModule', { vcc: 0, send: 1, recv: 2, gnd: 3 });
module.dataSymbolLength = 0.1 // 100usec baud rate
led.send([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1])
```