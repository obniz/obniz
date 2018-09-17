# KXR94-2050

Analog Tri-axis Accelerometer.


## obniz.wired(obniz, {x, y, z [, vcc, gnd, enable, self_test]})

vcc, gnd, enable，selt test are options.


```javascript

// Javascript Example
let sensor = obniz.wired("KXR94_2050", {x: 2, y: 1, z: 0, gnd:3, vcc:11 });
   
```


## \[await] getWait

get accelerometer values.


```javascript
// Javascript Example
let sensor = obniz.wired("KXR94_2050", {x: 2, y: 1, z: 0, gnd:3, vcc:11 });

let values = await sensor.getWait();

console.log(values.x);
console.log(values.y);
console.log(values.z);

```