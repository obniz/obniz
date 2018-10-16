# LogicAnalyzer
LogicAnalyzer record samples read from io periodically.
This is useful when digital bus signal check.
Only one LogicAnalyzer can be used with one obniz.

### How work

LogicAnalyzer start logging by trigger.  
Default trigger is "value change".
When It occur, then data will be recorded until desired duration.
After done, LogicAnalyzer start monitoring io change(= continue working).
one sample becomes one 1/0.

![](./images/logiana_0.png)

sampling interval and duration can be configured.
For example interval is 1 millisecond and duration is 800ms then your will get 800 data of array.
A data should bet times of 8.

### Trigger Option

Default trigger is "value change". But It is interrupted by some noises. Configure triggerValue/triggerValueSamples to filter it.

1. triggerValue - desired start value. true/false
2. triggerValueSamples - after this samples recorded then record will start.

This trigger settings is "trigger when true/(or false) keeps more than X after io change"

![](./images/logiana_1.png)


## logicAnalyzer.start({io, interval, duration});
start logic analyzer on given io.
interval means period(second) reading io value.
data_long means how long does logicAnalyzer collect the data.

For example, collect the data from io0 changed, 2ms period and 1sec long
```Javascript
// Javascript Example
obniz.logicAnalyzer.start({io:0, interval:2, duration:1000});  // start on io0. 2ms interval and 1sec long.
obniz.logicAnalyzer.onmeasured = function(array) {
  console.log(array);
}
```
## logicAnalyzer.start(io, interval, duration, triggerValue, triggerValueSamples);
start logic analyzer on given io with trigger.

trigger is optional trigger configuration.
without this, logicAnalyzer will start with any io level changes. trigger specify start position.
value means start value. true/false. samples means how that values consists.
So, With below sample code, you will receive only data which start with "0, 0, 0" 
```Javascript
// Javascript Example
obniz.logicAnalyzer.start({io:0, interval:2, duration:1000, triggerValue:false, triggerValueSamples:3});  // start on io0. 2ms interval and 1sec long.
obniz.logicAnalyzer.onmeasured = function(array) {
  console.log(array);
}
```

## logicAnalyzer.onmeasured(bytes)
callback function which be called when data arrived.
arrived data is 0/1 array.
and it's every data is measured sample on every period.

```Javascript
// Javascript Example
obniz.logicAnalyzer.start({io:0, interval:2, duration:1000});  // start on io0. 1ms interval and 1sec long.

obniz.logicAnalyzer.onmeasured = function(array) {
  console.log(array);
}
```
## logicAnalyzer.end()
Stop the logic analyzer.

```Javascript
// Javascript Example
obniz.logicAnalyzer.start({io:0, interval:2, duration:1000});  // start on io0. 1ms interval and 1sec long.
obniz.logicAnalyzer.end();
```