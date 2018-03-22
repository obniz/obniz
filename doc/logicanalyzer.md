# LogicAnalyzer
LogicAnalyzer collect values readed from io periodically.
This is useful when digital bus signal check.
This monitors will start when io changed.


## logicAnalyzer.start({io, interval, duration});
start logic analyzer on given io.
interval measn period(second) reading io value.
data_long measn how long does logcanalyzer collect the data.

For example, collect the data from io0 changed, 2msec period and 1sec long
```Javascript
// Javascript Example
obniz.logicAnalyzer.start({io:0, interval:2, duration:1000});  // start on io0. 2msec interval and 1sec long.
obniz.logicAnalyzer.onmeasured = function(array) {
  console.log(array);
}
```
## logicAnalyzer.start(io, interval, duration, trigerValue, trigerValueSamples);
start logic analyzer on given io with triger.

triger is optioanl triger configration.
without this, logicAnalyzer will start with any io level changes. triger specify start position.
value measn start value. true/false. samples measn how that values consists.
So, With below sample code, you will receive only datas which start with "false, false, false" 3bit.
```Javascript
// Javascript Example
obniz.logicAnalyzer.start({io:0, interval:2, duration:1000, trigerValue:false, trigerValueSamples:3});  // start on io0. 2msec interval and 1sec long.
obniz.logicAnalyzer.onmeasured = function(array) {
  console.log(array);
}
```

## logicAnalyzer.onmeasured(bytes)
callback function which be called when data arrived.
arrived data is byte array.
and it's every bit is measured data on every period.
For example, [0x01, 0x00] means io0 is onece high(around 2msec) but after that, it stay 0.

```Javascript
// Javascript Example
obniz.logicAnalyzer.start({io:0, interval:2, duration:1000});  // start on io0. 1msec interval and 1sec long.

obniz.logicAnalyzer.onmeasured = function(array) {
  console.log(array);
}
```
## logicAnalyzer.end()
Stop the logic analyzer.

```Javascript
// Javascript Example
obniz.logicAnalyzer.start({io:0, interval:2, duration:1000});  // start on io0. 1msec interval and 1sec long.
obniz.logicAnalyzer.end();
```