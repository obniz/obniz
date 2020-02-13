# Peripherals SPI
It is General Purpose SPI
spi0 and spi1 are available.

## obniz.getFreeSpi()
It returns unused spi.
```javascript
var spi = obniz.getFreeSpi();
```
It shows error when no more spi is available.
```javascript
var spi0 = obniz.getFreeSpi();
var spi1 = obniz.getFreeSpi();
var spi2 = obniz.getFreeSpi(); // Error
```

## start({mode, clk, mosi, miso, frequency, [, drive, pull, gnd] } );
It starts spi. Now the mode is only "master".
drive and pull are optional settings for io output. 
Default settings are drive:5v, pull:null.
See more using obniz.io.drive() or pull(). 

```Javascript
// Javascript Example
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000}); 
var ret = await obniz.spi0.writeWait([0x12, 0x98]);
console.log("received: "+ret);

// drive and pull is optional
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000, drive: "5v", pull:null}); 
```
## [await] writeWait(data);
It sends data to spi and wait until data are received.
The received data length is the same as the sent data.
Max length is 1024 bytes.

```Javascript
// Javascript Example
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000}); 
var ret = await obniz.spi0.writeWait([0x12, 0x98]);
console.log("received: "+ret);
```

## write(data);
It only sends data to spi and does not receive it.
Max length is 1024 bytes.

```Javascript
// Javascript Example
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000}); 
obniz.spi0.write([0x12, 0x98]);
```

## end();
It ends spi

```Javascript
// Javascript Example
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, clock:1000000}); 
obniz.spi0.write([0x12, 0x98]);
obniz.spi0.end();
```