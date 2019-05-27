# ENC03R_Module

Gyrosensor ENC03R Module.
It detect "Rotation Speed".

![](./image.jpg)


## wired

```javascript
// Javascript Example
var enc03r = obniz.wired("ENC03R_Module", {gnd:0, vcc:1, out2:2, out1:3 });
enc03r.onchange1 = function(val){
  console.log("" + val + " (deg/sec)");
}
```

## onchange1, onchange2

Set callbacks.
The unit is deg/sec.

```javascript
// Javascript Example
var enc03r = obniz.wired("ENC03R_Module", {gnd:0, vcc:1, out2:2, out1:3 });
enc03r.onchange1 = function(val){
  console.log("1: " + val + " (deg/sec)");
}
enc03r.onchange2 = function(val){
  console.log("2: " + val + " (deg/sec)");
}
```

## [await]get1Wait,[await]get2Wait,

Get value once. 
The unit is deg/sec.

```javascript
// Javascript Example
var enc03r = obniz.wired("ENC03R_Module", {gnd:0, vcc:1, out2:2, out1:3 });
var val1 = await enc03r.get1Wait();
var val2 = await enc03r.get1Wait();

console.log("1: " + val1 + " (deg/sec)");
console.log("2: " + val2 + " (deg/sec)");

```