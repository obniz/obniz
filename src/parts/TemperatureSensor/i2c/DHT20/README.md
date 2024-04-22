# Temperature Sensor - DHT20
Temperature and Humidity sensor DHT20

![](image.jpg)

## wired(obniz,  {vcc , sda, scl, gnd} )
the address of DHT20 can be choosed from 0x44,0x45.

```javascript
// Javascript Example
var sensor = obniz.wired("DHT20",{vcc:0, sda:1, gnd:2,  scl:3});
```

## [await] getAllDataWait()
Get temperature and Humidity. 

```javascript
// Javascript Example
let device = obniz.wired("DHT20",{vcc:0, sda:1, gnd:2,  scl:3});

let data = await device.getAllDataWait();
console.log(data);
    
```


## [await] getTemperatureWait()
Get a temperature. Unit is Celsius.

```javascript
// Javascript Example
let device = obniz.wired("DHT20",{vcc:0, sda:1, gnd:2,  scl:3});

let data = await device.getTemperatureWait();
console.log(data);
    
```

## [await] getHumidityWait()
Get a Humidity. Unit is Ratio(%).

```javascript
// Javascript Example
let device = obniz.wired("DHT20",{vcc:0, sda:1, gnd:2,  scl:3});

let data = await device.getHumidityWait();
console.log(data);
    
```
