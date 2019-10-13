# Temperature Sensor - DHT12
Temperature and Humidity sensor DHT12

![](./image.jpg)

## wired(obniz,  {vcc , sda, scl, gnd} )
the address of DHT12 can be choosed from 0x44,0x45.

```javascript
// Javascript Example
var sensor = obniz.wired("DHT12",{scl:26,sda:0});
```

## [await] getAllDataWait()
Get temperature and Humidity. 

```javascript
// Javascript Example
let device = obniz.wired("DHT12",{scl:26,sda:0});

let data = await device.getAllDataWait();
console.log(data);
    
```


## [await] getTempWait()
Get a temperature. Unit is Celsius.

```javascript
// Javascript Example
let device = obniz.wired("DHT12",{scl:26,sda:0});

let data = await device.getTempWait();
console.log(data);
    
```

## [await] getHumdWait()
Get a Humidity. Unit is Ratio(%).

```javascript
// Javascript Example
let device = obniz.wired("DHT12",{scl:26,sda:0});

let data = await device.getHumdWait();
console.log(data);
    
```
