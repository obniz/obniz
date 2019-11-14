# HX711

24-bit ADC designed for weigh scales.

![](./image.jpg)


## wired(obniz, {vcc, gnd, sck, dout})

Vcc and gnd is optinal if you supply it another way.

```javascript
var sensor = obniz.wired("hx711" , {gnd:0, dout:1, sck:2, vcc:3} );
```

## [await]  getValueWait(times = 1)
Get a value which is calculated with offset, scale.
Set times param if you want use average. 

```javascript
// Javascript Example
var sensor = obniz.wired("hx711" , {gnd:0, dout:1, sck:2, vcc:3} );
var value = await sensor.getValueWait(10); //10 times average
console.log('grams:' + value);
```

## [await] zeroAdjust(times = 1)
Set offset with current value. 
```javascript
// Javascript Example
var sensor = obniz.wired("hx711" , {gnd:0, dout:1, sck:2, vcc:3} );
await sensor.zeroAdjustWait();
var value = await sensor.getValueWait(10); //10 times average
console.log('grams:' + value);
```

## setOffset

```javascript
// Javascript Example
var sensor = obniz.wired("hx711" , {gnd:0, dout:1, sck:2, vcc:3} );
sensor.setOffset(7000);
var value = await sensor.getValueWait(10); //10 times average
console.log('grams:' + value);
```



## setScale

```javascript
// Javascript Example
var sensor = obniz.wired("hx711" , {gnd:0, dout:1, sck:2, vcc:3} );
sensor.setScale(2280);
var value = await sensor.getValueWait(10); //10 times average
console.log('grams:' + value);
```

## powerDown
Into sleep Mode.
```javascript
// Javascript Example
var sensor = obniz.wired("hx711" , {gnd:0, dout:1, sck:2, vcc:3} );
sensor.powerDown();
```


## powerUp
Wake up from sleep Mode.
```javascript
// Javascript Example
var sensor = obniz.wired("hx711" , {gnd:0, dout:1, sck:2, vcc:3} );
sensor.powerUp();
```
