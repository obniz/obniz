# Peripherals I2C
i2c can be used.
There is only i2c0 that is available. Max speed is 1Mhz.  
Master/Slave mode.
But slave mode only works with "written" events. You can't set data to be read.

Overview
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
It returns unused i2c.
```javascript
var i2c = obniz.getFreeI2C();
```
It equals to i2c0 because only i2c0 is available. ( no i2c1 ).
```javascript
(obniz.getFreeI2C() === obniz.i2c0) => true
```
It shows error if no more i2c is available
```javascript
var i2c0 = obniz.getFreeI2C();
var i2c1 = obniz.getFreeI2C(); // Error
```

## start({mode, sda, scl, clock[, pull, gnd]})
It starts i2c on given io sda, scl.
Internal pull up is optional for io output setting. 
By default it is pull:null.
See more on obniz.ioX.pull(). 
For using internal-pull-up, you should specify "3v" to connect to 3.3v targets, and "5v" for 5v targets.
When you choose internal pull up, speed is limited to up to 100khz, because internal pull up is not so tough.
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

It sends data to device which has the address - 7bit address only.
Max data length is 1024;

```Javascript
// Javascript Example
obniz.i2c0.start({mode: "master",sda:2, scl:3, clock:400000, pull:null}); 
obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
```

## [await] readWait(address, length);
It reads data from the device. length defines the length of bytes. The treatment of address is same as write() function.
This function will wait until data is received.
Max length is 1024;

```Javascript
// Javascript Example
obniz.i2c0.start({mode: "master",sda:2, scl:3, clock:400000, pull:null}); 
var ret = await obniz.i2c0.readWait(0x50, 1);
console.log("read "+ret);
```

## i2cX.onwritten = function(data){}
Slave mode only.  
It is a callback that is called when data is written.
Received data is fragmented.
When written data is 100byte, you possibly receive it in 56 byte and 44 byte.
For data over 1024 bytes, few bytes may be dropped.
```Javascript
// Javascript Example
obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address: 0x01});
obniz.i2c0.onwritten = function(data){
  console.log(data);
}
```

## onerror = function(err){}

> from obniz.js 1.14.0

It sets a function to receive error when i2c bus error occurs.
By setting a function, obniz.error will never be called.

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