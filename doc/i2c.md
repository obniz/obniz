# Peripherals I2C
I2C.
i2c0 is only available. max speed 1Mhz.  
Master/Slave.  
But slave mode only works with "written" events. you cant set data to be read.

OverView
```Javascript
// Example
// master mode sda=2 scl=3 400khz no internal pull up
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000}); 
obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
var ret = await obniz.i2c0.readWait(0x50, 1);
console.log("read "+ret);

// use internal pull up
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000, pull:"5v"}); 
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:100000, pull:"3v"}); 

// slave mode
obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address: 0x01});
```

# obniz.getFreeI2C()
It returns not used i2c.
```javascript
var i2c = obniz.getFreeI2C();
```
It equals to i2c0 because i2c0 is only available. ( no i2c1 ).
```javascript
(obniz.getFreeI2C() === obniz.i2c0) => true
```
It throws error if no more i2c available
```javascript
var i2c0 = obniz.getFreeI2C();
var i2c1 = obniz.getFreeI2C(); // Error
```

## start({mode, sda, scl, clock[, pull, gnd]})
start i2c on given io sda, scl.
internal pull up is optional for io output setting. 
Default it pull:null.
See more for obniz.ioX.pull(). 
For using internal-pull-up, you should specify "3v" to connect 3.3v targets. "5v" when 5v targets.
When you choose internal pull up, speed is limited up to 100khz. Because internal pull up is not so tough.
Please add external pull-up resistor on scl/sda and choose pull:null when you need more speed.

```Javascript
// Javascript Example
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000}); 
obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
var ret = await obniz.i2c0.readWait(0x50, 1);
console.log("read "+ret);

// use internal pull up
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000, pull:"5v"}); 
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:100000, pull:"3v"}); 

// slave mode
obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address: 0x01});
```
## write(address, data);

send data to device which has the address. 7bit address only.
max data length is 1024;

```Javascript
// Javascript Example
obniz.i2c0.start({mode: "master",sda:2, scl:3, clock:400000, pull:null}); 
obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
```

## [await] readWait(address, length);
read the data from device. length define the length of bytes. Treatment of address is same as write() function.
This function will wait until data received.
max length is 1024;

```Javascript
// Javascript Example
obniz.i2c0.start({mode: "master",sda:2, scl:3, clock:400000, pull:null}); 
var ret = await obniz.i2c0.readWait(0x50, 1);
console.log("read "+ret);
```

## i2cX.onwritten = function(data){}
slave mode only.  
callbacks when data written.
received data is fragmented.
when written data is 100byte, you possibly get 56 byte and 44 byte separated.
over 1024 bytes data can be drop few bytes.
```Javascript
// Javascript Example
obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address: 0x01});
obniz.i2c0.onwritten = function(data){
  console.log(data);
}
```

## onerror = function(err){}

> from obniz.js 1.14.0

Setting i2c bus error handling callback.
By setting a function, obniz.error will be never called.

```Javascript
// Javascript Example
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000}); 
obniz.i2c0.onerror = function(err) {
  console.log('Error', err);
}
var ret = await obniz.i2c0.readWait(0x50, 1);
```

## end()
end i2c .

```Javascript
// Javascript Example
obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000}); 
obniz.i2c0.end();
```