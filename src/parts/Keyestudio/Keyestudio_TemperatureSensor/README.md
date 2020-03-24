# Temperature Sensor - LM35DZ
Keyestudio temperature sensor.

![](image.jpg)

## wired(obniz, {vcc, gnd, output})

name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | Signal pin outputs value of sensor(s pin of Keyestudio)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC for sensor(+ pin of Keyestudio)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND for sensor(- pin of Keyestudio)


```javascript
// Javascript Example
var tempsens = obniz.wired("Keyestudio_TemperatureSensor", {signal:0, vcc:1, gnd:2});
```


## onchange
callback function for temperature change.  
Unit of temp is Celsius.  

```javascript
// Javascript Example
var tempsens = obniz.wired("Keyestudio_TemperatureSensor", {signal:0, vcc:1, gnd:2});
tempsens.onchange = function(temp){
console.log(temp);
};
```


## [await]getWait
get temperature change.  
Unit of temp is Celsius.  

```javascript
// Javascript Example
var tempsens = obniz.wired("Keyestudio_TemperatureSensor", {signal:0, vcc:1, gnd:2});
var temp = await tempsens.getWait();
console.log(temp);
``` 
