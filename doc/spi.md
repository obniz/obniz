# Peripherals SPI
General Purpose SPI
spi0 and spi1 are available.

## obniz.getFreeSpi()
It returns not used spi.
```javascript
var spi = obniz.getFreeSpi();
```
It throw error when no more spi available.
```javascript
var spi0 = obniz.getFreeSpi();
var spi1 = obniz.getFreeSpi();
var spi2 = obniz.getFreeSpi(); // Error
```

## start({mode, clk, mosi, miso, frequency, [, drive, pull] } );
start spi. now mode is only "master"
drive and pull is optional for io output setting. 
Default it drive:5v, pull:null.
See more for obniz.io.drive() or pull(). 

```Javascript
// Javascript Example
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000}); 
var ret = await obniz.spi0.writeWait([0x12, 0x98]);
console.log("received: "+ret);

// drive and pull is optional
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000, drive: "5v", pull:null}); 
```
## [await] writeWait(data);
send a data to spi and wait until receive the data.
receive data length is same as sent data.
max length is 1024 bytes.

```Javascript
// Javascript Example
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000}); 
var ret = await obniz.spi0.writeWait([0x12, 0x98]);
console.log("received: "+ret);
```

## write(data);
just send a data to spi. no receive data arrived after sent.
max length is 1024 bytes.

```Javascript
// Javascript Example
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000}); 
obniz.spi0.write([0x12, 0x98]);
```

## end();
end spi

```Javascript
// Javascript Example
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, clock:1000000}); 
obniz.spi0.write([0x12, 0x98]);
obniz.spi0.end();
```