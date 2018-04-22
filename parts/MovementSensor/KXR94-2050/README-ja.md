# KXR94-2050

3軸加速度センサ
重力の向きや，どちらの方向に動いているかを知ることができます．


## obniz.wired(obniz, {x, y, z [, vcc, gnd, enable, self_test]})

vcc, gnd, enable，selt testはオプションです


```javascript

// Javascript Example
let sensor = obniz.wired("KXR94_2050", {x: 2, y: 1, z: 0, gnd:3, vcc:11 });
   
```


## \[await] getWait

３軸の加速度情報を取得します


```javascript
// Javascript Example
let sensor = obniz.wired("KXR94_2050", {x: 2, y: 1, z: 0, gnd:3, vcc:11 });
   
let values = sensor.getWait();

console.log(values);
/*
  { 
    x : 0.0,
    y : 0.1,
    z : 1.0
  } 
 */


```